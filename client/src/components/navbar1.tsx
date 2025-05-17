import {Menu, User} from "lucide-react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Button} from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent, SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import {useStore} from '@/store.ts'
import {Link} from 'react-router'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import {Skeleton} from '@/components/ui/skeleton.tsx'

interface MenuItem {
    title: string
    url: string
    description?: string
    icon?: React.ReactNode
    items?: MenuItem[]
}

interface Navbar1Props {
    logo?: {
        url: string
        src: string
        alt: string
        title: string
    }
    menu?: MenuItem[]
}

const Navbar1 = (
    {
        logo = {
            url: "/",
            src: "https://cdn-icons-png.flaticon.com/512/6456/6456651.png",
            alt: "Shoe",
            title: "Shoes Shop",
        },
        menu = [],
    }: Navbar1Props) => {
    const user = useStore(state => state.user)
    const loading = useStore(state => state.loading)
    const logout = useStore(state => state.logout)

    const handleLogout = async () => {
        await logout()
    }

    return (
        <section className="py-4">
            <div className="container m-auto">
                {/* Desktop Menu */}
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link to={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt}/>
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {loading ? (
                            <Skeleton className={'w-40 h-8'}/>
                        ) : !!user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant={'outline'} size="sm">
                                        <User/> {user?.name}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <Link to={'/login'}>Login</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link to={'/register'}>Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between px-4">
                        {/* Logo */}
                        <Link to={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt}/>
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                {!!user && (
                                    <SheetHeader className="flex flex-row items-center gap-2 p-4">
                                        <User className={'m-0'}/>
                                        <div>{user?.name}</div>
                                    </SheetHeader>
                                )}
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {menu.map((item) => renderMobileMenuItem(item))}
                                    </Accordion>


                                    <div className="flex flex-col gap-3">
                                        {!!user ? (
                                            <Button onClick={handleLogout}>
                                                Logout
                                            </Button>
                                        ) : (
                                            <>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={'/login'}>Login</Link>
                                                </Button>
                                                <Button asChild size="sm">
                                                    <Link to={'/register'}>Sign Up</Link>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    )
}

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className={'text-sm'}>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-80 bg-popover text-popover-foreground">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink asChild key={subItem.title} className="w-80">
                            <SubMenuLink item={subItem}/>
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        )
    }

    return (
        <NavigationMenuItem key={item.title}>
            <Link
                to={item.url}
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
            >
                {item.title}
            </Link>
        </NavigationMenuItem>
    )
}

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <SubMenuLink key={subItem.title} item={subItem}/>
                    ))}
                </AccordionContent>
            </AccordionItem>
        )
    }

    return (
        <Link key={item.title} to={item.url} className="text-md font-semibold">
            {item.title}
        </Link>
    )
}

const SubMenuLink = ({item}: { item: MenuItem }) => {
    return (
        <Link
            className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
            to={item.url}
        >
            <div className="text-foreground">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </Link>
    )
}

export {Navbar1}
