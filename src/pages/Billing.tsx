import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Billing = () => {
  const currentPlan = {
    name: "Professional",
    price: "₹29.99",
    billingCycle: "monthly",
    nextBillingDate: "May 15, 2023",
    features: [
      "Unlimited job applications",
      "Priority profile placement",
      "Direct messaging",
      "Custom portfolio showcase",
      "Early access to exclusive castings"
    ]
  };

  const transactions = [
    {
      id: "INV-001",
      date: "Apr 15, 2023",
      amount: "₹29.99",
      status: "paid"
    },
    {
      id: "INV-002",
      date: "Mar 15, 2023",
      amount: "₹29.99",
      status: "paid"
    },
    {
      id: "INV-003",
      date: "Feb 15, 2023",
      amount: "₹29.99",
      status: "paid"
    }
  ];

  const paymentMethods = [
    {
      id: "pm1",
      type: "card",
      details: "**** **** **** 4242",
      expiry: "09/25",
      isDefault: true
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      <Tabs defaultValue="subscription" className="w-full mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
        </TabsList>

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
                  {currentPlan.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Billing Cycle</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan.billingCycle.charAt(0).toUpperCase() + currentPlan.billingCycle.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Next Billing Date</h3>
                  <p className="text-sm text-muted-foreground">{currentPlan.nextBillingDate}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Plan Features</h3>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">Change Plan</Button>
                <Button variant="destructive">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{method.details}</p>
                      <p className="text-sm text-muted-foreground">Expires: {method.expiry}</p>
                    </div>
                  </div>
                  <div>
                    {method.isDefault && <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/10">Default</Badge>}
                  </div>
                </div>
              ))}
              <Button className="w-full">Add Payment Method</Button>
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
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium sr-only">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b last:border-0">
                        <td className="py-4">{transaction.id}</td>
                        <td className="py-4">{transaction.date}</td>
                        <td className="py-4">{transaction.amount}</td>
                        <td className="py-4">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                            {transaction.status}
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
            <CardFooter className="flex justify-end">
              <Button variant="link" size="sm">View all transactions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing; 