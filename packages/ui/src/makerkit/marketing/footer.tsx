import { cn } from '../../lib/utils';

interface FooterSection {
  heading: React.ReactNode;
  links: Array<{
    href: string;
    label: React.ReactNode;
  }>;
}

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logo: React.ReactNode;
  description: React.ReactNode;
  copyright: React.ReactNode;
  sections: FooterSection[];
  securityBadge?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  logo,
  description,
  copyright,
  sections,
  securityBadge,
  ...props
}) => {
  return (
    <footer
      className={cn(
        'site-footer border-metal-chrome bg-metal-50 relative mt-auto w-full border-t py-8 xl:py-16 2xl:py-20',
        className,
      )}
      {...props}
    >
      <div className="container">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0">
          <div className="flex w-full gap-x-3 lg:w-4/12 xl:w-4/12 xl:space-x-6 2xl:space-x-8">
            <div className="flex flex-col gap-y-4">
              <div>{logo}</div>

              <div className="flex flex-col gap-y-4">
                <div>
                  <p className="text-metal-600 text-sm">{description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col gap-y-4 lg:flex-row lg:justify-end lg:gap-x-6 lg:gap-y-0 xl:gap-x-12">
            {sections.map((section, index) => (
              <div key={index}>
                <div className="flex flex-col gap-y-1">
                  <FooterSectionHeading>{section.heading}</FooterSectionHeading>

                  <FooterSectionList>
                    {section.links.map((link, linkIndex) => (
                      <FooterLink key={linkIndex} href={link.href}>
                        {link.label}
                      </FooterLink>
                    ))}
                  </FooterSectionList>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright — always last on mobile */}
        <div className="border-metal-chrome text-metal-steel mt-8 border-t pt-6 text-xs">
          <p>{copyright}</p>
          {securityBadge ? (
            <p className="mt-2 text-xs text-gray-400">{securityBadge}</p>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

function FooterSectionHeading(props: React.PropsWithChildren) {
  return (
    <span className="font-heading text-metal-900 text-sm font-medium">
      {props.children}
    </span>
  );
}

function FooterSectionList(props: React.PropsWithChildren) {
  return <ul className="flex flex-col gap-y-1">{props.children}</ul>;
}

function FooterLink({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <li className="text-metal-600 hover:text-primary text-sm font-medium transition-colors [&>a]:transition-colors">
      <a href={href}>{children}</a>
    </li>
  );
}
