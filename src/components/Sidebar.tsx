// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";
// import {
//   Book,
//   ChevronDownIcon,
//   Home,
//   ListVideo,
//   LucideGamepad,
//   Menu,
//   Mic2,
//   Music,
//   Play,
//   RadioIcon,
//   SquareStack,
//   User,
//   Video,
// } from "lucide-react";
// import Link from "next/link";
// import * as React from "react";
// import { usePathname } from "next/navigation";

// type Menu = {
//   label: string;
//   name: string;
//   icon: React.ReactNode;
//   submenu?: Submenu[];
//   href: string;
// };

// type Submenu = {
//   name: string;
//   icon: React.ReactNode;
//   href: string;
// };

// export function Sidebar() {
//   const menus: Menu[] = [
//     {
//       label: "Khám phá",
//       name: "Home",
//       icon: <Home size={15} className="mr-2" />,
//       href: "/",
//     },
//     // {
//     //     label: "Library",
//     //     name: "Playlist",
//     //     icon: <Play size={15} className="mr-2" />,
//     //     href: "/home/playlist",
//     //     submenu: [
//     //         {
//     //             name: "Playlist 1",
//     //             icon: <ListVideo size={15} className="mr-2" />,
//     //             href: "/home/",
//     //         },
//     //         {
//     //             name: "Playlist 2",
//     //             icon: <ListVideo size={15} className="mr-2" />,
//     //             href: "/home/",
//     //         },
//     //         {
//     //             name: "Playlist 3",
//     //             icon: <ListVideo size={15} className="mr-2" />,
//     //             href: "/home/",
//     //         },
//     //     ],
//     // },
//     {
//       label: "Nội dung",
//       name: "Animes",
//       icon: <Video size={15} className="mr-2" />,
//       href: "/animes/",
//     },
//     {
//       label: "Nội dung",
//       name: "Comics",
//       icon: <Book size={15} className="mr-2" />,
//       href: "/comics/",
//     },
//     {
//       label: "Nội dung",
//       name: "Thử thách",
//       icon: <LucideGamepad size={15} className="mr-2" />,
//       href: "/challenges/",
//     },
//   ];

//   const uniqueLabels = Array.from(new Set(menus.map((menu) => menu.label)));

//   return (
//     <ScrollArea className="h-lvh bg-transparent w-[27%] hidden lg:block">
//       <div className="sm:p-0 mt-5 ">
//         {uniqueLabels.map((label, index) => (
//           <React.Fragment key={label}>
//             {label && (
//               <p
//                 className={`text-[13px] text-left pl-4 tracking-wider font-medium text-slate-300 ${
//                   index > 0 ? "mt-10" : ""
//                 }`}
//               >
//                 {label}
//               </p>
//             )}
//             {menus
//               .filter((menu) => menu.label === label)
//               .map((menu) => (
//                 <React.Fragment key={menu.name}>
//                   {menu.submenu && menu.submenu.length > 0 ? (
//                     <Accordion
//                       key={menu.name}
//                       type="single"
//                       className="mt-[-10px] mb-[-10px] p-0 font-normal"
//                       collapsible
//                     >
//                       <AccordionItem
//                         value="item-1"
//                         className="m-0 p-0 font-normal"
//                       >
//                         <AccordionTrigger>
//                           <a
//                             key={menu.name}
//                             className="w-full flex justify-start text-xs font-normal h-10 bg-background my-2 items-center p-4 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-background"
//                           >
//                             <div
//                               className={cn(
//                                 "flex justify-between w-full [&[data-state=open]>svg]:rotate-180"
//                               )}
//                             >
//                               <div className="flex">
//                                 <div className="w-6">"{menu.icon}"</div>
//                                 {menu.name}
//                               </div>
//                             </div>
//                           </a>
//                         </AccordionTrigger>
//                         <AccordionContent>
//                           {menu.submenu.map((submenu) => (
//                             <Link
//                               key={submenu.name}
//                               href={submenu.href}
//                               className="text-white mt-0 mb-0 flex text-xs h-10 bg-transparent dark:bg-transparent dark:hover:bg-emerald-400 dark:hover:text-background my-2 items-center p-4 hover:bg-primary hover:text-white"
//                             >
//                               <div className="w-6">{submenu.icon}</div>
//                               {submenu.name}
//                             </Link>
//                           ))}
//                         </AccordionContent>
//                       </AccordionItem>
//                     </Accordion>
//                   ) : (
//                     <div key={menu.name}>
//                       <Link
//                         href={menu.href}
//                         className="flex text-xs h-10 bg-transparent p-4 items-center  hover:bg-emerald-400 text-white"
//                       >
//                         <div className="w-6">{menu.icon}</div>
//                         {menu.name}
//                       </Link>
//                     </div>
//                   )}
//                 </React.Fragment>
//               ))}
//           </React.Fragment>
//         ))}
//       </div>
//     </ScrollArea>
//   );
// }

"use client";

import * as React from "react";
import { Heading } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import classnames from "classnames";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { LuMenu } from "react-icons/lu";
import { usePathname } from "next/navigation";
import path from "path";

type SidebarElement = React.ElementRef<"aside">;
type RootProps = React.ComponentPropsWithoutRef<"aside">;

interface NavItem {
  title: string;
  value: string;
  icon: React.ReactNode; // Icon component or SVG
}

interface SidebarProps extends RootProps {
  navItems: NavItem[];
  title?: string;
  session?: any;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ navItems, title, session, ...props }, forwardedRef) => {
    const role = session?.user.role;

    // Filter navItems based on user role
    const filteredNavItems = navItems.filter(item => {
      if (role === 'Admin') return true;
      if (role === 'Editor') {
        return ['animes', 'comics', 'challenge', 'album', 'banners' ].includes(item.value);
      }
      if (['Advertiser', 'Partner'].includes(role)) {
        return false;
      }
      return false;
    });

    if (role === 'Advertiser') {
      return;
    }

    return (
      <aside
        ref={forwardedRef}
        className="px-6 min-w-[275px] max-w-[275px] flex flex-col gap-4 border-r border-slate-6 bg-white"
        {...props}
      >
        <nav className="flex flex-col gap-4">
          <Collapsible.Root defaultOpen>
            {filteredNavItems && filteredNavItems.length > 0 && (
              <>
                <Collapsible.Content className="relative mt-3 lg:block hidden">
                  <div className="absolute left-2.5 w-px h-full bg-slate-6" />

                  <div className="flex flex-col truncate space-y-1">
                    <LayoutGroup id="sidebar">
                      {filteredNavItems.map((item) => {
                        const pathName = usePathname();
                        const lastPathname = pathName.split("/")[1];
                        const isCurrentPage = lastPathname === item.value;
                        return (
                          <Link
                            key={item.title}
                            href={`/${item.value}`}
                            className="bg-transparent h-12 flex items-center"
                          >
                            <motion.span
                              className={classnames(
                                "text-[14px] flex items-center border-l-3 font-semibold gap-2 w-full h-12 text-black relative transition ease-in-out duration-200 pl-6",
                                {
                                  "text-emerald-400 border-emerald-400":
                                    isCurrentPage,
                                  "hover:text-blue-500 hover:border-blue-500":
                                    title !== item.title,
                                  "font-semibold": isCurrentPage,
                                  "border-emerald-400": isCurrentPage,
                                }
                              )}
                            >
                              {isCurrentPage && (
                                <motion.span
                                  layoutId="sidebar"
                                  className="absolute left-0 right-0 top-0 bottom-0 bg-cyan-5"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div className="bg-cyan-11 w-px absolute top-1 left-2.5 h-6" />
                                </motion.span>
                              )}
                              {item.icon} {/* Display the icon here */}
                              {item.title}
                            </motion.span>
                          </Link>
                        );
                      })}
                    </LayoutGroup>
                  </div>
                </Collapsible.Content>
                <Accordion>
                  <AccordionItem
                    key="anchor"
                    aria-label="Anchor"
                    disableIndicatorAnimation
                    className="lg:hidden block"
                    indicator={<LuMenu className="mr-6 w-6 h-6" />}
                  >
                    <Collapsible.Content className="relative mt-1">
                      <div className="absolute left-2.5 w-px h-full bg-slate-6" />

                      <div className="pb-2 flex flex-col truncate space-y-1">
                        <LayoutGroup id="sidebar">
                          {filteredNavItems.map((item) => {
                            const isCurrentPage = title === item.title;
                            return (
                              <Link
                                key={item.title}
                                href={`/${item.value}`}
                                className="h-12 flex items-center mx-2"
                              >
                                <motion.span
                                  className={classnames(
                                    "text-[16px] flex items-center font-bold gap-2 w-full pl-4 h-10 text-black relative transition ease-in-out duration-200",
                                    {
                                      "text-emerald-400": isCurrentPage,
                                      "hover:text-slate-12":
                                        title !== item.title,
                                      "font-bold": isCurrentPage,
                                      "bg-blue-500": isCurrentPage,
                                    }
                                  )}
                                >
                                  {isCurrentPage && (
                                    <motion.span
                                      layoutId="sidebar"
                                      className="absolute left-0 right-0 top-0 bottom-0 bg-cyan-5"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                    >
                                      <div className="bg-cyan-11 w-px absolute top-1 left-2.5 h-6" />
                                    </motion.span>
                                  )}
                                  {item.icon} {/* Display the icon here */}
                                  {item.title}
                                </motion.span>
                              </Link>
                            );
                          })}
                        </LayoutGroup>
                      </div>
                    </Collapsible.Content>
                  </AccordionItem>
                </Accordion>
              </>
            )}
          </Collapsible.Root>
        </nav>
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";