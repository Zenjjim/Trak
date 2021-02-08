import { Box } from '@material-ui/core';
import Sidebar from 'components/Sidebar';
type LayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box display='flex'>
      <Sidebar />
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
};

export default Layout;
