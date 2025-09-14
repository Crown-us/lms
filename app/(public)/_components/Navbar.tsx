"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
    Code,
    Palette,
    Briefcase,
    BarChart3,
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    ChevronDown,
    Home,
    Users,
    HelpCircle,
    MessageSquare,
    Phone,
    TrendingUp,
    Settings,

} from "lucide-react";

import Logo from "@/public/Logo.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "@/app/(public)/_components/UserDropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const courseCategories = [
    {
        title: "Programming",
        href: "/courses/programming",
        description: "Learn web development, mobile apps, and software engineering.",
        icon: Code,
    },
    {
        title: "Design",
        href: "/courses/design",
        description: "Master UI/UX design, graphic design, and creative tools.",
        icon: Palette,
    },
    {
        title: "Business",
        href: "/courses/business",
        description: "Develop business skills, marketing, and entrepreneurship.",
        icon: Briefcase,
    },
    {
        title: "Data Science",
        href: "/courses/data-science",
        description: "Analytics, machine learning, and data visualization.",
        icon: BarChart3,
    },
];

const homeMenuItems = [
    {
        title: "Home",
        href: "/",
        description: "Return to the homepage and explore our platform.",
        icon: Home,
    },
    {
        title: "About Us",
        href: "/about",
        description: "Learn more about our mission and team.",
        icon: Users,
    },
    {
        title: "How It Works",
        href: "/how-it-works",
        description: "Discover how our learning platform works.",
        icon: HelpCircle,
    },
    {
        title: "Testimonials",
        href: "/testimonials",
        description: "Read success stories from our students.",
        icon: MessageSquare,
    },
    {
        title: "Contact",
        href: "/contact",
        description: "Get in touch with our support team.",
        icon: Phone,
    },
];

const dashboardSections = [
    {
        title: "My Courses",
        href: "/admin/courses",
        description: "View and manage your enrolled courses.",
        icon: BookOpen,
    },
    {
        title: "Progress",
        href: "/admin/progress",
        description: "Track your learning progress and achievements.",
        icon: TrendingUp,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        description: "Manage your account and preferences.",
        icon: Settings,
    },
];

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    title: string;
    children: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    title: string;
    children: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

function ListItem({ title, children, href, icon: Icon, ...props }: ListItemProps) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <div className="text-sm font-medium leading-none">{title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

export function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto max-w-screen-2xl px-4 md:px-8 flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src={Logo} alt="Logo" className="h-7 w-7" />
                        <span className="text-xl font-extrabold tracking-tight font-plusjakartasans">
              <span className="text-primary">Edu</span>
              <span className="text-foreground">KT</span>
            </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="md:hidden">
                            ☰
                        </Button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto max-w-screen-2xl px-4 md:px-8 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={Logo} alt="Logo" className="h-7 w-7" />
                    <span className="text-xl font-extrabold tracking-tight font-plusjakartasans">
            <span className="text-[oklch(65%_0.12_230)]">Edu</span>
            <span className="text-[oklch(70%_0.13_145)]">KT</span>
          </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {/* Home Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <GraduationCap size={16} className="mr-2" />
                                    Home
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] md:grid-cols-2">
                                        {homeMenuItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Courses Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <BookOpen size={16} className="mr-2" />
                                    Courses
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/courses"
                                                >
                                                    <BookOpen className="h-6 w-6" />
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        Browse All Courses
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Discover thousands of courses across different categories and skill levels.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        {courseCategories.map((category) => (
                                            <ListItem
                                                key={category.title}
                                                title={category.title}
                                                href={category.href}
                                                icon={category.icon}
                                            >
                                                {category.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Dashboard - Only show if logged in */}
                            {!isPending && session && (
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        <LayoutDashboard size={16} className="mr-2" />
                                        Dashboard
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] md:grid-cols-2">
                                            {dashboardSections.map((section) => (
                                                <ListItem
                                                    key={section.title}
                                                    title={section.title}
                                                    href={section.href}
                                                >
                                                    {section.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right Side - Auth & Theme Toggle */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                        {isPending ? (
                            <div className="flex gap-2">
                                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                            </div>
                        ) : session ? (
                            <UserDropdown
                                email={session.user.email}
                                image={session.user.image || 'https://avatar.vercel.sh/${session?.user.email}'}
                                name={session?.user.name && session?.user.name.length > 0
                                    ? session?.user.name
                                    : session?.user.email.split("@")[0]
                            }
                            />
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                        className: "text-foreground hover:text-primary font-mono",
                                    })}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/login"
                                    className={buttonVariants({
                                        size: "sm",
                                        className: "bg-primary hover:bg-primary/80 text-primary-foreground font-mono",
                                    })}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="md:hidden">
                                ☰
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-5 bg-background/95 backdrop-blur border-r border-border">
                            <Link
                                href="/"
                                className="flex items-center gap-2 mb-6"
                                onClick={() => setIsOpen(false)}
                            >
                                <Image src={Logo} alt="Logo" className="h-6 w-6" />
                                <span className="font-extrabold text-lg font-plusjakartasans text-foreground">
                  <span className="text-primary">Edu</span>
                  <span className="text-foreground">KT</span>
                </span>
                            </Link>

                            <div className="flex flex-col space-y-4 font-mono">
                                <Link href="/" onClick={() => setIsOpen(false)}>
                                    Home
                                </Link>
                                <Link href="/courses" onClick={() => setIsOpen(false)}>
                                    Courses
                                </Link>
                                {!isPending && session && (
                                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                                        Dashboard
                                    </Link>
                                )}
                            </div>

                            {!isPending && !session && (
                                <div className="mt-8 flex flex-col space-y-3 font-mono">
                                    <Link
                                        href="/login"
                                        className={buttonVariants({
                                            variant: "ghost",
                                            size: "sm",
                                            className: "text-foreground hover:text-primary",
                                        })}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/login"
                                        className={buttonVariants({
                                            size: "sm",
                                            className: "bg-primary hover:bg-primary/80 text-primary-foreground",
                                        })}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}

                            <div className="mt-6">
                                <ThemeToggle />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}