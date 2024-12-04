import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "ui-group/sidebar-wrapper ui-flex ui-min-h-svh ui-w-full has-[[data-variant=inset]]:ui-bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "ui-flex ui-h-full ui-w-[--sidebar-width] ui-flex-col ui-bg-sidebar ui-text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="ui-w-[--sidebar-width] ui-bg-sidebar ui-p-0 ui-text-sidebar-foreground [&>button]:ui-hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="ui-flex ui-h-full ui-w-full ui-flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="ui-group ui-peer ui-hidden md:ui-block ui-text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "ui-duration-200 ui-relative ui-h-svh ui-w-[--sidebar-width] ui-bg-transparent ui-transition-[width] ui-ease-linear",
            "group-data-[collapsible=offcanvas]:ui-w-0",
            "group-data-[side=right]:ui-rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:ui-w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:ui-w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "ui-duration-200 ui-fixed ui-inset-y-0 ui-z-10 ui-hidden ui-h-svh ui-w-[--sidebar-width] ui-transition-[left,right,width] ui-ease-linear md:ui-flex",
            side === "left"
              ? "ui-left-0 group-data-[collapsible=offcanvas]:ui-left-[calc(var(--sidebar-width)*-1)]"
              : "ui-right-0 group-data-[collapsible=offcanvas]:ui-right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "ui-p-2 group-data-[collapsible=icon]:ui-w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:ui-w-[--sidebar-width-icon] group-data-[side=left]:ui-border-r group-data-[side=right]:ui-border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="ui-flex ui-h-full ui-w-full ui-flex-col ui-bg-sidebar group-data-[variant=floating]:ui-rounded-lg group-data-[variant=floating]:ui-border group-data-[variant=floating]:ui-border-sidebar-border group-data-[variant=floating]:ui-shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("ui-h-7 ui-w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="ui-sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "ui-absolute ui-inset-y-0 ui-z-20 ui-hidden ui-w-4 ui--translate-x-1/2 ui-transition-all ui-ease-linear after:ui-absolute after:ui-inset-y-0 after:ui-left-1/2 after:ui-w-[2px] hover:after:ui-bg-sidebar-border group-data-[side=left]:ui--right-4 group-data-[side=right]:ui-left-0 sm:ui-flex",
        "[[data-side=left]_&]:ui-cursor-w-resize [[data-side=right]_&]:ui-cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:ui-cursor-e-resize [[data-side=right][data-state=collapsed]_&]:ui-cursor-w-resize",
        "group-data-[collapsible=offcanvas]:ui-translate-x-0 group-data-[collapsible=offcanvas]:after:ui-left-full group-data-[collapsible=offcanvas]:hover:ui-bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:ui--right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:ui--left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "ui-relative ui-flex ui-min-h-svh ui-flex-1 ui-flex-col ui-bg-background",
        "peer-data-[variant=inset]:ui-min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:ui-m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ui-ml-2 md:peer-data-[variant=inset]:ui-ml-0 md:peer-data-[variant=inset]:ui-rounded-xl md:peer-data-[variant=inset]:ui-shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "ui-h-8 ui-w-full ui-bg-background ui-shadow-none focus-visible:ui-ring-2 focus-visible:ui-ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("ui-flex ui-flex-col ui-gap-2 ui-p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("ui-flex ui-flex-col ui-gap-2 ui-p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("ui-mx-2 ui-w-auto ui-bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "ui-flex ui-min-h-0 ui-flex-1 ui-flex-col ui-gap-2 ui-overflow-auto group-data-[collapsible=icon]:ui-overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("ui-relative ui-flex ui-w-full ui-min-w-0 ui-flex-col ui-p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "ui-duration-200 ui-flex ui-h-8 ui-shrink-0 ui-items-center ui-rounded-md ui-px-2 ui-text-xs ui-font-medium ui-text-sidebar-foreground/70 ui-outline-none ui-ring-sidebar-ring ui-transition-[margin,opa] ui-ease-linear focus-visible:ui-ring-2 [&>svg]:ui-size-4 [&>svg]:ui-shrink-0",
        "group-data-[collapsible=icon]:ui--mt-8 group-data-[collapsible=icon]:ui-opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "ui-absolute ui-right-3 ui-top-3.5 ui-flex ui-aspect-square ui-w-5 ui-items-center ui-justify-center ui-rounded-md ui-p-0 ui-text-sidebar-foreground ui-outline-none ui-ring-sidebar-ring ui-transition-transform hover:ui-bg-sidebar-accent hover:ui-text-sidebar-accent-foreground focus-visible:ui-ring-2 [&>svg]:ui-size-4 [&>svg]:ui-shrink-0",
        // Increases the hit area of the button on mobile.
        "after:ui-absolute after:ui--inset-2 after:md:ui-hidden",
        "group-data-[collapsible=icon]:ui-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("ui-w-full ui-text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("ui-flex ui-w-full ui-min-w-0 ui-flex-col ui-gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("ui-group/menu-item ui-relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "ui-peer/menu-button ui-flex ui-w-full ui-items-center ui-gap-2 ui-overflow-hidden ui-rounded-md ui-p-2 ui-text-left ui-text-sm ui-outline-none ui-ring-sidebar-ring ui-transition-[width,height,padding] hover:ui-bg-sidebar-accent hover:ui-text-sidebar-accent-foreground focus-visible:ui-ring-2 active:ui-bg-sidebar-accent active:ui-text-sidebar-accent-foreground disabled:ui-pointer-events-none disabled:ui-opacity-50 ui-group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:ui-pointer-events-none aria-disabled:ui-opacity-50 data-[active=true]:ui-bg-sidebar-accent data-[active=true]:ui-font-medium data-[active=true]:ui-text-sidebar-accent-foreground data-[state=open]:hover:ui-bg-sidebar-accent data-[state=open]:hover:ui-text-sidebar-accent-foreground group-data-[collapsible=icon]:ui-!size-8 group-data-[collapsible=icon]:ui-!p-2 [&>span:last-child]:ui-truncate [&>svg]:ui-size-4 [&>svg]:ui-shrink-0",
  {
    variants: {
      variant: {
        default: "hover:ui-bg-sidebar-accent hover:ui-text-sidebar-accent-foreground",
        outline:
          "ui-bg-background ui-shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:ui-bg-sidebar-accent hover:ui-text-sidebar-accent-foreground hover:ui-shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "ui-h-8 ui-text-sm",
        sm: "ui-h-7 ui-text-xs",
        lg: "ui-h-12 ui-text-sm group-data-[collapsible=icon]:ui-!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "ui-absolute ui-right-1 ui-top-1.5 ui-flex ui-aspect-square ui-w-5 ui-items-center ui-justify-center ui-rounded-md ui-p-0 ui-text-sidebar-foreground ui-outline-none ui-ring-sidebar-ring ui-transition-transform hover:ui-bg-sidebar-accent hover:ui-text-sidebar-accent-foreground focus-visible:ui-ring-2 ui-peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:ui-size-4 [&>svg]:ui-shrink-0",
        // Increases the hit area of the button on mobile.
        "after:ui-absolute after:ui--inset-2 after:md:ui-hidden",
        "ui-peer-data-[size=sm]/menu-button:top-1",
        "ui-peer-data-[size=default]/menu-button:top-1.5",
        "ui-peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:ui-hidden",
        showOnHover &&
          "ui-group-focus-within/menu-item:opacity-100 ui-group-hover/menu-item:opacity-100 data-[state=open]:ui-opacity-100 ui-peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:ui-opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "ui-absolute ui-right-1 ui-flex ui-h-5 ui-min-w-5 ui-items-center ui-justify-center ui-rounded-md ui-px-1 ui-text-xs ui-font-medium ui-tabular-nums ui-text-sidebar-foreground ui-select-none ui-pointer-events-none",
      "ui-peer-hover/menu-button:text-sidebar-accent-foreground ui-peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "ui-peer-data-[size=sm]/menu-button:top-1",
      "ui-peer-data-[size=default]/menu-button:top-1.5",
      "ui-peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:ui-hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("ui-rounded-md ui-h-8 ui-flex ui-gap-2 ui-px-2 ui-items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="ui-size-4 ui-rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="ui-h-4 ui-flex-1 ui-max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "ui-mx-3.5 ui-flex ui-min-w-0 ui-translate-x-px ui-flex-col ui-gap-1 ui-border-l ui-border-sidebar-border ui-px-2.5 ui-py-0.5",
      "group-data-[collapsible=icon]:ui-hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "ui-flex ui-h-7 ui-min-w-0 ui--translate-x-px ui-items-center ui-gap-2 ui-overflow-hidden ui-rounded-md ui-px-2 ui-text-sidebar-foreground ui-outline-none ui-ring-sidebar-ring hover:ui-bg-sidebar-accent hover:ui-text-sidebar-accent-foreground focus-visible:ui-ring-2 active:ui-bg-sidebar-accent active:ui-text-sidebar-accent-foreground disabled:ui-pointer-events-none disabled:ui-opacity-50 aria-disabled:ui-pointer-events-none aria-disabled:ui-opacity-50 [&>span:last-child]:ui-truncate [&>svg]:ui-size-4 [&>svg]:ui-shrink-0 [&>svg]:ui-text-sidebar-accent-foreground",
        "data-[active=true]:ui-bg-sidebar-accent data-[active=true]:ui-text-sidebar-accent-foreground",
        size === "sm" && "ui-text-xs",
        size === "md" && "ui-text-sm",
        "group-data-[collapsible=icon]:ui-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
