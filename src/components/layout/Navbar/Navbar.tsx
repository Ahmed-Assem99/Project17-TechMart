"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  LayoutGrid,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Tag,
  Truck,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/layout/Logo";
import Link from "next/link";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import { Suspense, useContext } from "react";
import { counterContext } from "@/contexts/counterContext";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: LayoutGrid,
  },
  {
    title: "Brands",
    href: "/brands",
    icon: Tag,
  },
  { title: "Orders", href: "/allorders", icon: Tag },
];

const activeClassName = "text-[#64843f] font-bold";

function isActive(pathName: string, href: string) {
  return pathName === href || pathName.startsWith(`${href}/`);
}




function MobileNavLinks({ pathName }: { pathName: string }) {
  return navItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition-colors hover:bg-muted",
        isActive(pathName, item.href) && cn("bg-muted", activeClassName),
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/10">
        <item.icon className="size-4" />
      </span>
      {item.title}
      <ChevronRight className="ml-auto size-4 text-muted-foreground" />
    </Link>
  ));
}

function ActiveMobileNavLinks() {
  const pathName = usePathname();
  return <MobileNavLinks pathName={pathName} />;
}

export default function Navbar() {
  function DesktopNavLinks({ pathName }: { pathName: string }) {
  return navItems.filter((el)=>{
    return !(session.status=="unauthenticated"&&(el.href=="/cart"||el.href=="/allorders"))
  }).map((item) => (
    <Link
      key={item.title}
      href={item.href}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        isActive(pathName, item.href) &&
          cn("bg-background shadow-sm", activeClassName),
      )}
    >
      {item.title}
    </Link>
  ));
}
function ActiveDesktopNavLinks() {
  const pathName = usePathname();
  return (session.status!="loading" && <DesktopNavLinks pathName={pathName} />);
}

  const session = useSession()

  let { numOfCartItems } = useContext(counterContext);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="bg-foreground text-background">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-2 text-xs font-medium sm:px-4">
          <Truck className="size-3.5" />
          Free delivery on orders over 500 EGP
        </p>
      </div>
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-6 sm:px-4">
        <Logo className="flex-1" />
        <div className="hidden items-center gap-1 rounded-full bg-muted p-1 lg:inline-flex">
          <Suspense fallback={<DesktopNavLinks pathName="" />}>
            <ActiveDesktopNavLinks />
          </Suspense>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden rounded-full sm:inline-flex"
          >
            <Search />
          </Button>
{   session.status=="authenticated" &&       <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative rounded-full"
            nativeButton={false}
            render={<Link href="/cart" />}
          >
            <ShoppingCart />
            <Badge className="absolute -top-1 -right-1/2 h-5 min-w-5 px-1 text-[10px] font-bold tabular-nums ring-2 ring-background">
              {numOfCartItems}
            </Badge>
          </Button>}
          <div className="mx-1 hidden h-6 w-px bg-border lg:block" />
         { session.status=="unauthenticated" && <> <Button
            variant="ghost"
            className="hidden lg:inline-flex"
            nativeButton={false}
            render={<Link href="#" />}
          >
            <Link href={"/api/auth/signin"}>Sign in</Link>
          </Button>
          <Button
            className="hidden rounded-full px-4 lg:inline-flex"
            nativeButton={false}
            render={<Link href="#" />}
          >
            Sign up
          </Button>
          </>
         }
        {session.status=="authenticated" && <Button
        onClick={()=>signOut({callbackUrl:"/auth/signin"})}
            className="hidden rounded-full px-4 lg:inline-flex"
            nativeButton={false}
            render={<Link href="#" />}
          >
            Sign out
          </Button>}
          <Sheet>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open Menu"
                  className="rounded-full"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[90%] max-w-sm flex-col gap-0 p-6"
            >
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <nav className="-mx-3 my-8 flex flex-1 flex-col gap-1">
                <Suspense fallback={<MobileNavLinks pathName="" />}>
                  <ActiveMobileNavLinks />
                </Suspense>
              </nav>
              <div className="mt-auto grid gap-3">
                <Button
                  variant={"outline"}
                  className="h-10"
                  nativeButton={false}
                  render={<Link href="#" />}
                >
                  <Link href={"/api/auth/signin"}>Log in</Link>
                </Button>
                <Button
                  className="h-10"
                  nativeButton={false}
                  render={<Link href="#" />}
                >
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
