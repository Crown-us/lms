"use client"

import {
    BookOpenIcon,
    ChevronDownIcon,
    HomeIcon,
    LayoutDashboardIcon,
    LogOutIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from "next/link"

import {useSignout} from "@/hooks/use-singout";

interface iAppProps {
    name: string
    email: string
    image: string
}

export function UserDropdown({ name, email, image }: iAppProps) {
    const handleSignOut = useSignout()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={image} alt="Profile Image" />
                        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{email}</div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/" className="flex items-center space-x-2">
                            <HomeIcon className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/course" className="flex items-center space-x-2">
                            <BookOpenIcon className="w-4 h-4" />
                            <span>Courses</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="flex items-center space-x-2">
                            <LayoutDashboardIcon className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
