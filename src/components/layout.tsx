import MenuList from "./menu";

interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      {children}
      <MenuList />
    </div>
  );
};
