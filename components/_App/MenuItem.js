import { Menu, Image, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MenuItem = ({ href, icon, src, text, ...options }) => {
  const router = useRouter();
  const isActive = () => href === router.pathname;

  const renderItem = () => {
    if (icon) {
      return <Icon name={icon} {...options} />;
    } else if (src) {
      return <Image src={src} {...options} />;
    }

    return null;
  };

  const renderMenuItem = () => {
    return (
      <Menu.Item header active={isActive()}>
        {renderItem()}
        {text}
      </Menu.Item>
    );
  };

  return href ? <Link href={href}>{renderMenuItem()}</Link> : renderMenuItem();
};

export default MenuItem;
