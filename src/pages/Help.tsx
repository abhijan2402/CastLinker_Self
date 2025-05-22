import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I create an appealing profile?",
    answer:
      "To create an appealing profile, upload a professional headshot, add a detailed bio highlighting your experience, skills, and achievements. Include your portfolio with your best work samples and make sure all information is up-to-date.",
  },
  {
    question: "How can I find casting calls relevant to me?",
    answer:
      "You can use our advanced search filters to narrow down casting calls based on your location, role type, production type, and more. You can also save your search preferences to receive notifications for new matching opportunities.",
  },
  {
    question: "How do I apply for a casting call?",
    answer:
      "To apply for a casting call, navigate to the job posting, review the requirements, and click on the 'Apply Now' button. Follow the application instructions provided by the casting director, which may include submitting your portfolio, answering questions, or providing additional materials.",
  },
  {
    question: "What should I do to prepare for an audition?",
    answer:
      "Research the production and role, rehearse your lines or prepared piece, arrive early, dress appropriately for the role, bring copies of your headshot and resume, be professional and courteous, and be prepared to take direction during the audition.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team through the contact form on this page, by emailing support@FilmCollab.com, or by clicking the chat icon in the bottom right corner of any page to start a live chat with our team during business hours.",
  },
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqItems
      : faqItems.filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Help Center</h1>
      <p className="text-muted-foreground mb-6">
        Find answers to common questions or contact our support team
      </p>

      <div className="relative mb-8">
        <Input
          className="w-full pl-10"
          placeholder="Search for help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:border-primary transition-colors duration-200">
          <CardHeader>
            <div className="mb-2 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-center">Getting Started</CardTitle>
            <CardDescription className="text-center">
              New to FilmCollab? Learn the basics to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="link">View Guides</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors duration-200">
          <CardHeader>
            <div className="mb-2 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <CardTitle className="text-center">Tutorials</CardTitle>
            <CardDescription className="text-center">
              Step-by-step guides to help you make the most of FilmCollab
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="link">View Tutorials</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors duration-200">
          <CardHeader>
            <div className="mb-2 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-center">Contact Support</CardTitle>
            <CardDescription className="text-center">
              Need personalized help? Reach out to our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="link">Contact Us</Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="mb-8">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="text-muted-foreground py-4">
            No results found for "{searchQuery}". Try a different search term.
          </p>
        )}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Fill out the form below and our support team will get back to you as
            soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="What's your question about?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-2 min-h-[120px] border rounded bg-background text-foreground"
                placeholder="Please describe your issue in detail"
              ></textarea>
            </div>
            <Button className="w-full md:w-auto">Submit Ticket</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
