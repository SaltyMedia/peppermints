import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Building,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareKanban,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/shadcn/components/nav-main";
import { NavProjects } from "@/shadcn/components/nav-projects";
import { NavUser } from "@/shadcn/components/nav-user";
import { TeamSwitcher } from "@/shadcn/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shadcn/ui/sidebar";
import ThemeSettings from "../../../components/ThemeSettings";
import { useRouter } from "next/router";
import { useUser } from "../../../store/session";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import CreateTicketModal from "../../../components/CreateTicketModal";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useRouter();

  const { loading, user, fetchUserProfile } = useUser();
  const locale = user ? user.language : "en";

  const [keypressdown, setKeyPressDown] = useState(false);

  const { t, lang } = useTranslation("peppermint");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    location.push("/auth/login");
  }

  if (location.pathname.includes("/admin") && user.isAdmin === false) {
    location.push("/");
    alert("You do not have the correct perms for that action.");
  }

  if (user && user.external_user) {
    location.push("/portal");
  }

  const data = {
    teams: [
      {
        name: "Peppermint",
        logo: GalleryVerticalEnd,
        plan: `version: ${process.env.NEXT_PUBLIC_CLIENT_VERSION}`,
      },
    ],
    navMain: [
      {
        title: t("sl_dashboard"),
        url: `/${locale}/`,
        icon: Building,
        isActive: location.pathname === "/" ? true : false,
        initial: "h",
      },
      {
        title: "Documents",
        url: `/${locale}/documents`,
        icon: FileText,
        isActive: location.pathname === "/documents" ? true : false,
        initial: "d",
        internal: true,
      },
      {
        title: "Issues",
        url: `/${locale}/issues`,
        icon: SquareKanban,
        isActive: location.pathname === "/issues" ? true : false,
        initial: "t",
        items: [
          {
            title: "Open",
            url: "/issues/open",
          },
          {
            title: "Closed",
            url: "/issues/closed",
          },
        ],
      },
      {
        title: "Admin",
        url: "/admin",
        icon: Settings,
        isActive: true,
      },
    ],
  };

  function handleKeyPress(event: any) {
    const pathname = location.pathname;

    // Don't override browser shortcuts
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (
      document.activeElement!.tagName !== "INPUT" &&
      document.activeElement!.tagName !== "TEXTAREA" &&
      !document.activeElement!.className.includes("ProseMirror") &&
      !pathname.includes("/new")
    ) {
      switch (event.key) {
        case "c":
          setKeyPressDown(true);
          break;
        case "h":
          location.push("/");
          break;
        case "d":
          location.push("/documents");
          break;
        case "t":
          location.push("/issues");
          break;
        case "a":
          location.push("/admin");
          break;
        case "o":
          location.push("/issues/open");
          break;
        case "f":
          location.push("/issues/closed");
          break;
        default:
          break;
      }
    }
  }

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, location]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="flex items-center gap-2 ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <img src="/favicon/favicon-32x32.png" className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-xl">Peppermint</span>
            <span className="truncate text-xs">
              version: {process.env.NEXT_PUBLIC_CLIENT_VERSION}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <CreateTicketModal
          keypress={keypressdown}
          setKeyPressDown={setKeyPressDown}
        />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="hidden sm:block ">
          <ThemeSettings />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
