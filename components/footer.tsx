import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Investor Relations", href: "/investors" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Safety", href: "/safety" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
    {
      title: "Partners",
      links: [
        { label: "Partner Hub", href: "/partners" },
        { label: "Affiliate Program", href: "/affiliates" },
        { label: "Connectivity Partners", href: "/connectivity" },
        { label: "Property Owners", href: "/owners" },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile: collapsed accordion */}
        <div className="md:hidden">
          <Accordion type="multiple" className="divide-y divide-gray-800">
            {footerSections.map((section) => (
              <AccordionItem key={section.title} value={section.title.toLowerCase()} className="border-b border-gray-800">
                <AccordionTrigger className="text-white text-base py-3">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-4">
                  <ul className="space-y-2 pl-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Desktop: expanded columns */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src="/logo-footer.png" 
                alt="Agoda" 
                className="h-16 w-auto"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm mt-8">
            <p>&copy; 2025 Atoll Discovery Pvt Ltd. All rights reserved.</p>
          
          </div>
        </div>
      </div>
    </footer>
  )
}
