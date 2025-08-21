import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import { Icon } from '@iconify/react';
import { useNavigate , useLocation} from 'react-router-dom';

export default function TabNavigation({ onPersonClick }) {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const tabs = [
    { icon: 'material-symbols:home', route: '/' },
    { icon: 'majesticons:map-marker', route: '/map' },
    { icon: 'material-symbols:person', route: '/mypage' },
  ];

  useEffect(() => {
    const foundIndex = tabs.findIndex(tab => tab.route === location.pathname);
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    }
  }, [location.pathname]);

  const handleTabClick = (index) => {
    const tab = tabs[index];
    if (tab.route) {
    navigate(tab.route);
    }
  };

  return (
    <Wrapper>
      <TabBar>
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <TabItem
              key={index}
              onClick={() => handleTabClick(index)}
              $active={isActive}
            >
              <HoverEffectWrapper className="hover-wrapper" $active={isActive}>
                <WhiteRing>
                  <RedCircle>
                    <Icon icon={tab.icon} width="28" height="28" color="#ffffff" />
                  </RedCircle>
                </WhiteRing>
              </HoverEffectWrapper>

              <BaseIcon className="base-icon" $hidden={isActive}>
                <Icon icon={tab.icon} width="28" height="28" color="#ffffff" />
              </BaseIcon>
            </TabItem>
          );
        })}
      </TabBar>
    </Wrapper>
  );
}

/* ---------- styled-components ---------- */

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 600px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 997;

`;

const TabBar = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 66px;
  background: ${colors.main};
  border-bottom-left-radius: 26px;
  border-bottom-right-radius: 26px;
`;

const TabItem = styled.button`
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  &:hover .hover-wrapper {
    opacity: 1;
    transform: translate(-50%, -25%);
  }

  &:hover .base-icon {
    opacity: 0;
  }

  .hover-wrapper {
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transform: translate(-50%, ${({ $active }) => ($active ? '-25%' : '0')});
  }

  .base-icon {
    opacity: ${({ $active }) => ($active ? 0 : 1)};
  }
`;

const HoverEffectWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  transition: all 0.3s ease;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  z-index: 2;
`;

const BaseIcon = styled.div`
  transition: opacity 0.2s ease;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
`;

const WhiteRing = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 400px) {
    width: 56px;
    height: 56px;
  }
`;

const RedCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${colors.main};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 400px) {
    width: 46px;
    height: 46px;
  }
`;
