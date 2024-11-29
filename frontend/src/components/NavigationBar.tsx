import { Button } from '@mantine/core';
import { useAuth } from 'features/authentication/contexts/AuthProvider';
import { Link, useLocation } from 'react-router-dom';

interface NavigationBarProps {
  openLoginModal: () => void;
}

const NavigationBar = ({ openLoginModal }: NavigationBarProps) => {
  const { isAuthorized, logout } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container--header">
        <a href="/" className="header__logo">
          Academy<span>Blog</span>
        </a>
        <nav className="nav">
          <ul className="nav__list">
            <li>
              <Link
                to="/"
                className={`nav__link ${isActivePath('/') ? 'nav__link--active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                className={`nav__link ${isActivePath('/articles') ? 'nav__link--active' : ''}`}
              >
                Articles
              </Link>
            </li>
            <li>
              <Link
                to="/basic-react-query"
                className={`nav__link ${isActivePath('/basic-react-query') ? 'nav__link--active' : ''}`}
              >
                Basics RQ
              </Link>
            </li>
            {!isAuthorized ? (
              <li>
                <Button variant="filled" color="green" onClick={openLoginModal}>
                  Sign In
                </Button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/profile"
                    className={`nav__link ${isActivePath('/profile') ? 'nav__link--active' : ''}`}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Button variant="filled" color="red" onClick={logout}>
                    Log out
                  </Button>
                </li>
              </>
            )}
          </ul>
          <div className="nav__toggle nav__toggle--active">
            <img
              className="nav__open"
              src="/src/assets/images/menu-icon.svg"
              alt="Menu icon"
            />
            <img
              className="nav__close"
              src="/src/assets/images/close-icon.svg"
              alt="Menu icon"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
