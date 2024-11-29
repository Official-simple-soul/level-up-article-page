import { Button } from '@mantine/core';
import { useAuth } from 'features/authentication/contexts/AuthProvider';
import { Link, Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import LoginFormModal from 'features/authentication/LoginFormModal';
import NavigationBar from './NavigationBar';
import PremiumBanner from './PremiumBanner';
import Footer from './Footer';

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-auto">{children}</div>;
};

const Layout = () => {
  const [opened, { close, open }] = useDisclosure();

  return (
    <div>
      <NavigationBar openLoginModal={open} />
      <Container>
        <LoginFormModal isOpen={opened} closeModal={close} />
        <Outlet />
      </Container>
      <PremiumBanner />
      <Footer />
    </div>
  );
};

export default Layout;
