import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Receipt, Calculator, Users, Smartphone, WifiOff, Share2, ShieldCheck, Zap } from "lucide-react";

export const SEOContent = () => {
    const features = [
        {
            icon: <Users className="h-6 w-6 text-primary" />,
            title: "Fair Consumption Splitting",
            description: "Split bills based on exactly what each person ordered. No more splitting evenly when you only had a salad."
        },
        {
            icon: <Calculator className="h-6 w-6 text-primary" />,
            title: "Smart Math Adjustments",
            description: "Our algorithm handles tax, tip, and service charges proportionally, solving the 'who owes what' math instantly."
        },
        {
            icon: <WifiOff className="h-6 w-6 text-primary" />,
            title: "Works Offline",
            description: "No internet? No problem. FairSplit works completely offline as a PWA, perfect for travel or spotty signal areas."
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            title: "Private & Local",
            description: "Your data stays on your device. We don't store your financial details on any server. 100% private and secure."
        },
        {
            icon: <Smartphone className="h-6 w-6 text-primary" />,
            title: "Mobile Optimized",
            description: "Designed for the phone in your hand. Fast, responsive, and easy to use with one thumb while at the dinner table."
        },
        {
            icon: <Share2 className="h-6 w-6 text-primary" />,
            title: "Easy Export",
            description: "Send the breakdown to your friends via text or WhatsApp. Export summaries that explain exactly how the total was reached."
        }
    ];

    const faqs = [
        {
            question: "How do I split a bill fairly based on who ate what?",
            answer: "FairSplit makes this easy. First, add all the people at the table. Then, add each item from the receipt and tap the people who shared that specific item. The app automatically calculates each person's share, including their portion of tax and tip."
        },
        {
            question: "Can I split shared appetizers or drinks?",
            answer: "Yes! When adding an item, simply select multiple people. The cost will be divided equally among all selected participants for that specific item, making it perfect for shared plates and pitchers."
        },
        {
            question: "Is this bill splitter app free?",
            answer: "FairSplit is 100% free to use. There are no ads, no paywalls, and no hidden subscriptions. It is a completely free tool built to help groups dine together without the awkward math at the end."
        },
        {
            question: "Does FairSplit work offline?",
            answer: "Yes, FairSplit works completely offline as a Progressive Web App (PWA). Your data is saved locally on your device, so you can split bills even in restaurants with bad reception or while traveling abroad without data."
        },
        {
            question: "What currencies does FairSplit support?",
            answer: "FairSplit supports over 30 major global currencies including USD ($), EUR (€), GBP (£), INR (₹), JPY (¥), and many more. You can switch currencies instantly from the top menu."
        },
        {
            question: "Do my friends need to download the app?",
            answer: "No download is required for your friends. Only one person needs to enter the bill details. Once calculated, you can export a text summary or screenshot to share with the group via WhatsApp, iMessage, or Messenger."
        }
    ];

    return (
        <div className="space-y-24 py-12 md:py-24 animate-fade-in">


            {/* Features Grid */}
            <section aria-labelledby="features-title" className="bg-neutral-50/50 py-16 md:py-24 border-y border-border/40">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 id="features-title" className="text-3xl font-bold tracking-tight text-neutral-900 mb-4 font-display">
                            Why use FairSplit?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The precision tool for fair friends. Built to handle complex bills with ease.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4 bg-primary/5 w-12 h-12 rounded-lg flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-neutral-900">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section aria-labelledby="faq-title" className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 id="faq-title" className="text-3xl font-bold tracking-tight text-neutral-900 mb-4 font-display">
                        Frequently Asked Questions
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium text-neutral-900">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* SEO Text Footer */}
            <section className="max-w-4xl mx-auto px-4 text-center">
                <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    FairSplit is the ultimate free bill splitting calculator for restaurants, shared apartments, and group trips.
                    Unlike other splitwise alternatives, we focus on itemized splitting so you never pay for your friend's expensive steak
                    when you only had a salad. Our receipt splitter algorithm ensures fair payment distribution every time.
                </p>
            </section>
        </div>
    );
};
