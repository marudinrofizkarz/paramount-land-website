"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Award,
  ThumbsUp,
  Trophy,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ContactInquiryModal } from "@/components/contact-inquiry-modal";

interface SalesPersonProps {
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
  whatsapp: string;
  description: string;
  achievements: string[];
  experience: string;
  specialties: string[];
}

// Single in-house sales person data
const salesPerson: SalesPersonProps = {
  name: "Rizal Sutanto",
  role: "In-House Marketing Paramount Land",
  image:
    "https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755585343/Rizal_ok36fo.jpg",
  phone: "081387118533",
  email: "rizal.sutanto@paramount-land.com",
  whatsapp: "6281387118533",
  description:
    "I'm dedicated to helping my clients find their perfect property. With extensive knowledge of the local real estate market and a commitment to personalized service, I ensure that every client receives the attention and expertise they deserve.",
  achievements: [
    "Top Performer 2023 & 2024",
    "300+ Properties Sold",
    "Client Satisfaction Award",
  ],
  experience: "10+ years",
  specialties: [
    "Luxury Properties",
    "Commercial Real Estate",
    "Investment Properties",
  ],
};

export function SalesInHouseSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="inline-block bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            Your Personal Paramount Land Representative
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Meet Your In-House Sales
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Expert guidance and personalized service for all your property
            investment needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mt-12">
          {/* Photo Section - 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl h-[500px] lg:h-full">
              <Image
                src={salesPerson.image}
                alt={salesPerson.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-lg font-medium opacity-80">
                  {salesPerson.role}
                </p>
                <h3 className="text-3xl font-bold">{salesPerson.name}</h3>
                <div className="flex gap-3 mt-3">
                  <a
                    href={`tel:${salesPerson.phone.replace(/\s+/g, "")}`}
                    className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
                    aria-label="Call"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href={`mailto:${salesPerson.email}`}
                    className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://wa.me/${salesPerson.whatsapp.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20c15c] transition-colors p-2 rounded-full"
                    aria-label="WhatsApp"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.95l.14.23-1.1 4.02 4.12-1.08.22.13A7.94 7.94 0 0 0 20 12.05a7.86 7.86 0 0 0-2.4-5.73zm1.57 5.73a6.6 6.6 0 0 1-6.17 6.6 6.64 6.64 0 0 1-3.5-.97l-.67-.4-2.75.72.73-2.7-.42-.67a6.6 6.6 0 0 1-.98-3.49A6.64 6.64 0 0 1 12.05 5.3a6.58 6.58 0 0 1 4.7 1.96 6.63 6.63 0 0 1 2.42 4.8z" />
                      <path d="M9.65 7.65a.84.84 0 0 0-.62.29c-.24.26-.9.88-.9 2.13 0 1.26.92 2.48 1.04 2.64a8.4 8.4 0 0 0 3.74 3.21c1.85.73 2.23.58 2.64.55.4-.04 1.3-.54 1.48-1.05.19-.51.19-.95.13-1.04-.06-.09-.22-.14-.46-.25-.25-.1-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12-.16.26-.62.8-.76.97-.14.17-.28.19-.52.06-.25-.12-1.04-.38-1.98-1.22-.73-.66-1.23-1.46-1.37-1.7-.14-.26-.01-.39.11-.52.1-.12.23-.31.35-.47.11-.16.15-.27.22-.45.08-.17.04-.33-.02-.46-.06-.13-.55-1.32-.76-1.8-.2-.48-.4-.41-.55-.42h-.47z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Section - 3 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 flex flex-col"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-4">About Me</h3>
              <p className="text-muted-foreground mb-6">
                As Paramount Land's in-house sales representative, I'm dedicated
                to helping you find your perfect property. With extensive
                knowledge of our projects and a commitment to personalized
                service, I ensure that every client receives the attention and
                expertise they deserve.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Achievements */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
                      <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <h4 className="text-xl font-semibold">Achievements</h4>
                  </div>
                  <ul className="space-y-2">
                    {salesPerson.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Experience & Specialties */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <h4 className="text-xl font-semibold">Experience</h4>
                  </div>
                  <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    <strong>{salesPerson.experience}</strong> in real estate
                  </p>

                  <h4 className="font-semibold mt-4 mb-2">Specialties:</h4>
                  <ul className="space-y-1">
                    {salesPerson.specialties.map((specialty, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto">
                <h4 className="font-semibold mb-3 text-lg">Get in touch:</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`tel:${salesPerson.phone.replace(/\s+/g, "")}`}
                    className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-3 rounded-lg transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <span>{salesPerson.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${salesPerson.whatsapp.replace(
                      /[^0-9]/g,
                      ""
                    )}?text=Hello, I'm interested in one of your properties.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-[#25D366] hover:bg-[#20c15c] text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 mr-3"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.95l.14.23-1.1 4.02 4.12-1.08.22.13A7.94 7.94 0 0 0 20 12.05a7.86 7.86 0 0 0-2.4-5.73zm1.57 5.73a6.6 6.6 0 0 1-6.17 6.6 6.64 6.64 0 0 1-3.5-.97l-.67-.4-2.75.72.73-2.7-.42-.67a6.6 6.6 0 0 1-.98-3.49A6.64 6.64 0 0 1 12.05 5.3a6.58 6.58 0 0 1 4.7 1.96 6.63 6.63 0 0 1 2.42 4.8z" />
                      <path d="M9.65 7.65a.84.84 0 0 0-.62.29c-.24.26-.9.88-.9 2.13 0 1.26.92 2.48 1.04 2.64a8.4 8.4 0 0 0 3.74 3.21c1.85.73 2.23.58 2.64.55.4-.04 1.3-.54 1.48-1.05.19-.51.19-.95.13-1.04-.06-.09-.22-.14-.46-.25-.25-.1-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12-.16.26-.62.8-.76.97-.14.17-.28.19-.52.06-.25-.12-1.04-.38-1.98-1.22-.73-.66-1.23-1.46-1.37-1.7-.14-.26-.01-.39.11-.52.1-.12.23-.31.35-.47.11-.16.15-.27.22-.45.08-.17.04-.33-.02-.46-.06-.13-.55-1.32-.76-1.8-.2-.48-.4-.41-.55-.42h-.47z" />
                    </svg>
                    <span>Chat Via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 mb-4">
                <ThumbsUp className="h-8 w-8 text-primary dark:text-primary-light" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Service
              </h3>
              <p className="text-muted-foreground">
                Tailored approach to meet your specific property needs
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 mb-4">
                <Trophy className="h-8 w-8 text-primary dark:text-primary-light" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Award Winning</h3>
              <p className="text-muted-foreground">
                Recognized expertise and proven track record of success
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 mb-4">
                <Calendar className="h-8 w-8 text-primary dark:text-primary-light" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-muted-foreground">
                Available for property viewings at your convenience
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <ContactInquiryModal
              projectId="sales-consultation"
              projectName="Sales Consultation with Rizal Sutanto"
              triggerClassName="rounded-full px-8 py-3 text-base"
              buttonText="Schedule a Consultation"
              description={
                <>
                  Schedule a personal consultation with{" "}
                  <strong>Rizal Sutanto</strong>, our in-house sales
                  representative. Fill out the form below and he will contact
                  you to arrange a meeting at your convenience.
                </>
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
