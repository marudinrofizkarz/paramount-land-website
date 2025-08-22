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
  email: "rizal.sutanto@paramountland.com",
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
                    className="bg-green-500/80 hover:bg-green-500 transition-colors p-2 rounded-full"
                    aria-label="WhatsApp"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 1.009C5.929 1.009 1 5.938 1 12.009s4.929 11 11 11 11-4.929 11-11-4.929-11-11-11zm0 21c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z" />
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
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 1.009C5.929 1.009 1 5.938 1 12.009s4.929 11 11 11 11-4.929 11-11-4.929-11-11-11zm0 21c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z" />
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
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-8">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
