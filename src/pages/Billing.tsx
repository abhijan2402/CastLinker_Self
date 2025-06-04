import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { fetchData, postData } from "@/api/ClientFuntion";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface RazorpayOrderResponse {
  order: {
    id: string;
    amount: number;
    amount_due: number;
    amount_paid: number;
    currency: string;
    status: string;
    receipt: string;
    created_at: number;
  };
}

interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface Plan {
  name: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  features: string[];
}

interface Razorpay {
  open(): void;
  on(event: string, callback: (response: any) => void): void;
}

declare global {
  interface Window {
    Razorpay: new (options: any) => Razorpay;
  }
}

const Billing = () => {
  const planFeatures: any = {
    free: {
      type: "Free",
      price: "0",
      features: [
        "Create up to 2 projects per month",
        "Send up to 5 chat messages monthly",
        "Apply to 5 job opportunities each month",
        "Send 3 connection requests",
        "Share up to 5 posts per month",
      ],
    },
    professional: {
      type: "professional",
      price: "499",
      features: [
        "Create up to 5 projects per month",
        "Send up to 10 chat messages monthly",
        "Apply to 10 job opportunities each month",
        "Get early access to casting calls",
        "Send 10 connection requests",
        "Share up to 10 posts per month",
      ],
    },
    premium: {
      type: "premium",
      price: "999",
      features: [
        "Create up to 15 projects per month",
        "Send up to 15 chat messages monthly",
        "Apply to 20 job opportunities each month",
        "Send 30 connection requests",
        "Share up to 35 posts per month",
      ],
    },
  };
  const getNextBillingDate = (createdAt: string): string => {
    const date = new Date(createdAt);
    date.setMonth(date.getMonth() + 1);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const { user } = useAuth();
  const [transaction, setTransaction] = useState([]);
  const [activePlan, setActivePlan] = useState<any>([]);
  const currentPlans = {
    name: "Professional",
    price: "29.99",
    billingCycle: "monthly",
    nextBillingDate: "May 15, 2023",
    features: [
      "Unlimited job applications",
      "Priority profile placement",
      "Direct messaging",
      "Custom portfolio showcase",
      "Early access to exclusive castings",
    ],
  };

  const transactions = [
    {
      id: "INV-001",
      date: "Apr 15, 2023",
      amount: "₹29.99",
      status: "paid",
    },
    {
      id: "INV-002",
      date: "Mar 15, 2023",
      amount: "₹29.99",
      status: "paid",
    },
    {
      id: "INV-003",
      date: "Feb 15, 2023",
      amount: "₹29.99",
      status: "paid",
    },
  ];

  const paymentMethods = [
    {
      id: "pm1",
      type: "card",
      details: "**** **** **** 4242",
      expiry: "09/25",
      isDefault: true,
    },
  ];

  const currentPlanKey = Object.keys(planFeatures).find(
    (key) =>
      planFeatures[key]?.type?.toLowerCase() ===
      activePlan?.plan_name?.toLowerCase()
  );

  const currentPlan = currentPlanKey ? planFeatures[currentPlanKey] : null;

  // Handle Paymets
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscriptionPlan = async (plan_name: any, amount: any) => {
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay SDK. Please try again later.");
        return;
      }
      const payload = {
        amount: Math.round(Number(amount)) * 100,
        plan_name: plan_name,
      };

      const res = (await postData(
        "/api/payment/create-order",
        payload
      )) as RazorpayOrderResponse;

      if (res?.order?.id) {
        openRazorpay(res.order.id, plan_name);
      }
    } catch (error) {
      console.error("Error initiating subscription:", error);
    }
  };

  const openRazorpay = (orderId: string, plan: Plan) => {
    if (typeof window.Razorpay === "undefined") {
      alert("Payment system not ready. Please try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: Math.round(Number(plan.price) * 100),
      currency: "INR",
      name: "FilmCollab",
      description: `Subscription for ₹{plan.name}`,
      order_id: orderId,
      handler: async function (response: any) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;
        const payload = {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          amount: Math.round(Number(plan.price) * 100),
          plan_name: plan.name,
        };
        console.log(payload);
        const verifyRes = await postData(
          "/api/payment/verify-payment",
          payload
        );
        console.log("Verification Response:", verifyRes);
        if (verifyRes) {
          handleActivePlans();
          handleTransactionHistory();
        }
      },
      prefill: {
        name: user?.username || "Customer Name",
        email: user?.email || "email@example.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Handle Active Plans
  const handleActivePlans = async () => {
    const res: any = await fetchData("/api/payment/active-plan");
    if (res?.success && res.activePlan) {
      setActivePlan(res.activePlan);
    } else {
      console.warn("Unexpected response format or no active plan.");
    }
  };

  // Handle Transaction History
  const handleTransactionHistory = async () => {
    const res: any = await fetchData("/api/payment/transactions");
    if (res?.success && Array.isArray(res.transactions)) {
      setTransaction(res.transactions);
    } else {
      console.warn("Unexpected response format or no transactions.");
    }
  };

  useEffect(() => {
    handleActivePlans();
    handleTransactionHistory();
  }, [user]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      <Tabs defaultValue="subscription" className="w-full mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="payment-methods">Subscription Plans</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Manage your Subscription methods
              </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
              {/* Free Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.free.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Perfect for newcomers
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.free.price}
                    </span>
                    <span className="text-foreground/70">/month</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gold/30 hover:border-gold"
                    // onClick={() =>
                    //   handleSubscriptionPlan(
                    //     planFeatures.free.type,
                    //     planFeatures.free.price
                    //   )
                    // }
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {planFeatures.free.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="bg-card-gradient border border-gold/20 rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-gold text-cinematic text-xs font-bold py-1 px-3">
                  MOST POPULAR
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.professional.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    For serious film professionals
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.professional.price}
                    </span>
                    <span className="text-foreground/70">/month</span>
                  </div>

                  <Button
                    className="w-full bg-gold hover:bg-gold-dark text-cinematic"
                    onClick={() =>
                      handleSubscriptionPlan(
                        planFeatures.professional.type,
                        planFeatures.professional.price
                      )
                    }
                  >
                    Get Professional
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">Everything in Free, plus:</p>
                  <ul className="space-y-3">
                    {planFeatures.professional.features.map(
                      (feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                          <span className="text-sm text-foreground/90">
                            {feature}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.premium.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    For industry leaders
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.premium.price}
                    </span>
                    <span className="text-foreground/70">/month</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-gold/30 hover:border-gold"
                    onClick={() =>
                      handleSubscriptionPlan(
                        planFeatures.premium.type,
                        planFeatures.premium.price
                      )
                    }
                  >
                    Get Premium
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">
                    Everything in Professional, plus:
                  </p>
                  <ul className="space-y-3">
                    {planFeatures.premium.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing preferences
                  </CardDescription>
                </div>
                <Badge className="bg-primary text-black hover:bg-primary/90">
                  {activePlan.plan_name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Billing Cycle</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlans.billingCycle.charAt(0).toUpperCase() +
                      currentPlans.billingCycle.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Next Billing Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {getNextBillingDate(activePlan.createdAt)}
                  </p>
                </div>
              </div>

              {currentPlan && (
                <div>
                  <h3 className="font-semibold mb-2">Plan Features</h3>
                  <ul className="space-y-1">
                    {currentPlan.features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="text-sm flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">Update Plan</Button>
                <Button variant="destructive">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing-history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your recent invoices and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium">Invoice</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Plan Name</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Currency</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium sr-only">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b last:border-0"
                      >
                        <td className="py-4">{transaction.id}</td>
                        <td className="py-4">{transaction.createdAt}</td>
                        <td className="py-4">{transaction.plan_name}</td>
                        <td className="py-4">{transaction.amount}</td>
                        <td className="py-4">{transaction.currency}</td>
                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                          >
                            {transaction.payment_status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            {/* <CardFooter className="flex justify-end">
              <Button variant="link" size="sm">
                View all transactions
              </Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;
