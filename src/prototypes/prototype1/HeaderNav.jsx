import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../contexts/BasePath';
import { HeaderButton } from '../../components/Header';
import { Icon } from '../../icons/SailIcons';
import { DiamondAppIcon, BoatAppIcon, ZapAppIcon } from '../../icons/AppIcons';

export default function HeaderNav() {
  const navigate = useNavigate();
  const basePath = useBasePath();

  return (
    <div className="flex items-center">
      {/* App Dock - hidden */}

      <div className="flex items-center space-x-3 lg:space-x-1.5">
        <HeaderButton className="lg:hidden">
          <Icon name="apps" className="size-[20px]" />
        </HeaderButton>
        <HeaderButton className="hidden lg:flex">
          <Icon name="help" className="size-[16px]" />
        </HeaderButton>
        <HeaderButton>
          <Icon name="notifications" className="size-[20px] lg:size-[16px]" />
        </HeaderButton>
        <HeaderButton className="opacity-50 cursor-not-allowed pointer-events-none">
          <Icon name="settings" className="size-[20px] lg:size-[16px]" />
        </HeaderButton>
        <HeaderButton className="hidden lg:flex">
          <Icon name="addCircleFilled" className="text-brand-500 lg:size-[20px]" />
        </HeaderButton>
      </div>
    </div>
  );
}
