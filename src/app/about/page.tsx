"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  Building,
  Award,
  Users,
  Heart,
  Leaf,
  TrendingUp,
  CheckCircle,
  Calendar,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Company values with icons
const values = [
  {
    icon: Heart,
    title: "Passion",
    description:
      "We are passionate about creating properties that enrich lives and communities.",
  },
  {
    icon: CheckCircle,
    title: "Excellence",
    description:
      "We strive for excellence in every detail, from planning to execution.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We build meaningful connections and foster a sense of belonging.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We are committed to sustainable practices and environmental responsibility.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We embrace innovation to create future-ready living environments.",
  },
  {
    icon: Award,
    title: "Integrity",
    description:
      "We conduct business with honesty, transparency, and ethical standards.",
  },
];

// Milestones for the company timeline
const milestones = [
  {
    year: "1989",
    title: "Company Foundation",
    description:
      "Paramount Land was established with a vision to develop quality living spaces.",
  },
  {
    year: "1990s",
    title: "First Developments",
    description:
      "Launched our first residential projects in strategic locations.",
  },
  {
    year: "2000s",
    title: "Expansion Phase",
    description:
      "Expanded our portfolio to include commercial properties and mixed-use developments.",
  },
  {
    year: "2010",
    title: "Innovation Era",
    description:
      "Introduced smart home technology and sustainable building practices.",
  },
  {
    year: "2015",
    title: "Regional Growth",
    description:
      "Extended our presence across multiple regions with flagship projects.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description:
      "Embraced digital innovation in property development and customer experience.",
  },
  {
    year: "Present",
    title: "Building the Future",
    description:
      "Continuing our legacy of excellence while adapting to evolving needs.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={[]} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

          <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Building className="w-4 h-4 mr-2" />
                About Us
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Building Homes and People with Heart
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                For over three decades, Paramount Land has been committed to
                creating exceptional living spaces that foster community,
                well-being, and sustainable growth.
              </p>

              {/* Breadcrumb */}
              <nav className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground">About Us</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Column */}
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src="https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755138782/property-portal/gallery/gkypead2jrtazjxpeyd6.jpg"
                    alt="Paramount Land Headquarters"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6">
                      <span className="text-white/90 text-sm">
                        Paramount Land Headquarters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <Card className="absolute -bottom-10 -right-10 max-w-xs shadow-lg border-0 hidden md:block bg-card/90 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <span className="text-3xl font-bold">30+</span>
                      <p className="text-sm text-muted-foreground">
                        Years of Excellence
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-3xl font-bold">50+</span>
                      <p className="text-sm text-muted-foreground">
                        Projects Completed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-3xl font-bold">10,000+</span>
                      <p className="text-sm text-muted-foreground">
                        Happy Residents
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Column */}
              <div className="order-1 lg:order-2">
                <div className="space-y-8">
                  {/* Vision */}
                  <div className="space-y-4">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      Our Vision
                    </Badge>
                    <h2 className="text-3xl font-bold">
                      Creating Better Communities Through Thoughtful Development
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      We envision a future where sustainable development creates
                      thriving communities, enhances quality of life, and
                      preserves the environment for generations to come.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="space-y-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                      Our Mission
                    </Badge>
                    <h2 className="text-3xl font-bold">
                      Developing Properties That Enrich Lives
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Our mission is to develop high-quality, innovative, and
                      sustainable properties that create lasting value for our
                      customers, shareholders, and communities while maintaining
                      the highest standards of integrity and excellence.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button asChild size="lg">
                      <Link href="/projects">
                        Explore Our Projects
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Our Core Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Principles That Guide Our Work
              </h2>
              <p className="text-lg text-muted-foreground">
                At Paramount Land, our values are the foundation of everything
                we do. They shape our culture, guide our decisions, and define
                our commitment to excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    variants={fadeIn}
                  >
                    <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Company History Timeline */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                A Legacy of Excellence
              </h2>
              <p className="text-lg text-muted-foreground">
                From our humble beginnings to becoming a leading property
                developer, our journey has been defined by vision, perseverance,
                and commitment to quality.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-border" />

              {/* Timeline events */}
              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className={`relative ${
                      index % 2 === 0 ? "md:pl-0 md:pr-24" : "md:pr-0 md:pl-24"
                    } pl-12`}
                  >
                    {/* Year Indicator */}
                    <div
                      className={`absolute left-0 md:left-1/2 top-0 transform md:translate-x-[-50%] w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10 ${
                        index % 2 === 0
                          ? "md:translate-x-[-50%]"
                          : "md:translate-x-[-50%]"
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-primary-foreground" />
                    </div>

                    <div
                      className={`md:absolute md:top-0 md:w-1/2 ${
                        index % 2 === 0
                          ? "md:left-0 md:pr-12 text-right"
                          : "md:left-1/2 md:pl-12 text-left"
                      }`}
                    >
                      <Card
                        className={`border-none shadow-md ${
                          index % 2 === 0 ? "md:ml-auto" : ""
                        }`}
                      >
                        <CardContent className="p-6">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                            {milestone.year}
                          </span>
                          <h3 className="text-xl font-semibold mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Our Leadership
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet the Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Our experienced leadership team brings together decades of
                expertise in property development, architecture, finance, and
                community planning.
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                variants={fadeIn}
              >
                {/* <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                      alt="CEO"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold">Michael Anderson</h3>
                    <p className="text-muted-foreground mb-4">
                      Chief Executive Officer
                    </p>
                    <p className="text-sm">
                      With over 25 years in real estate development, Michael
                      leads Paramount Land's strategic vision and growth
                      initiatives.
                    </p>
                  </CardContent>
                </Card> */}
              </motion.div>

              {/* Team Member 2 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                variants={fadeIn}
              >
                {/* <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
                      alt="COO"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                    <p className="text-muted-foreground mb-4">
                      Chief Operating Officer
                    </p>
                    <p className="text-sm">
                      Sarah oversees day-to-day operations, ensuring excellence
                      in project execution and customer satisfaction.
                    </p>
                  </CardContent>
                </Card> */}
              </motion.div>

              {/* Team Member 3 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                variants={fadeIn}
              >
                {/* <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                      alt="CFO"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold">David Chen</h3>
                    <p className="text-muted-foreground mb-4">
                      Chief Financial Officer
                    </p>
                    <p className="text-sm">
                      David manages Paramount Land's financial strategy,
                      investment planning, and sustainable growth initiatives.
                    </p>
                  </CardContent>
                </Card> */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />

          <div className="relative z-10 container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-6">
                Join Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience the Paramount Land Difference
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Discover our portfolio of exceptional properties and find your
                perfect home or investment opportunity with Paramount Land.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/projects">
                    Browse Projects
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">
                    Contact Us
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Location Map Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge
                variant="outline"
                className="mb-4 flex items-center mx-auto w-fit"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Our Locations
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Where to Find Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Visit our headquarters or one of our regional offices. Our team
                is ready to assist you with all your property needs.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2234567890123!2d106.6234567890123!3d-6.234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sParamount%20Land%20Plaza!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="dark:hue-rotate-180 dark:invert"
                title="Paramount Land Office Location"
              />
            </div>

            {/* Office Locations */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {/* Headquarters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Headquarters
                      </h3>
                      <p className="text-muted-foreground">
                        Paramount Land Plaza
                        <br />
                        Jl. Boulevard Raya Gading Serpong
                        <br />
                        Tangerang 15810, Indonesia
                        <br />
                        <a
                          href="tel:+6281387118533"
                          className="text-primary hover:underline mt-2 inline-block"
                        >
                          081387118533
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Jakarta Office */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Jakarta Office
                      </h3>
                      <p className="text-muted-foreground">
                        Menara Paramount
                        <br />
                        Jl. Jend. Sudirman Kav. 52-53
                        <br />
                        Jakarta 12190, Indonesia
                        <br />
                        <a
                          href="tel:+6281387118533"
                          className="text-primary hover:underline mt-2 inline-block"
                        >
                          081387118533
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bandung Office */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Bandung Office
                      </h3>
                      <p className="text-muted-foreground">
                        Paramount Skyline
                        <br />
                        Jl. Merdeka No. 123
                        <br />
                        Bandung 40115, Indonesia
                        <br />
                        <a
                          href="tel:+6281387118533"
                          className="text-primary hover:underline mt-2 inline-block"
                        >
                          081387118533
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
