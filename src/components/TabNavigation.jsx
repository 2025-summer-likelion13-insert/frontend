import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function TabNavigation({ onPersonClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // 사람 아이콘은 route 없이 isModal만 둡니다.
  const tabs = [
    { icon: 'material-symbols:home', route: '/' },
    { icon: 'majesticons:map-marker', route: '/map' },
    { icon: 'material-symbols:person', route: '/mypage' },
  ];

  // 탭 클릭 핸들러
  const handleTabClick = (index) => {
    setActiveIndex(index);
    const tab = tabs[index];
      console.log("🖱️ 클릭된 탭:", index, tab);
    if (tab.isModal) {
        console.log("🙋 person 아이콘 클릭됨");
      onPersonClick?.(); // 모달 열기
    } else if (tab.route) {
        console.log("📍 라우팅:", tab.route);
      navigate(tab.route); // 라우팅
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
              $active={isActive} // ✅ transient prop
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

  /* hover 시 효과 */
  &:hover .hover-wrapper {
    opacity: 1;
    transform: translate(-50%, -25%);
  }

  &:hover .base-icon {
    opacity: 0;
  }

  /* ✅ active 상태를 transient prop으로 제어 */
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
  opacity: ${({ $active }) => ($active ? 1 : 0)}; /* ✅ transient prop */
  z-index: 2;
`;

const BaseIcon = styled.div`
  transition: opacity 0.2s ease;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)}; /* ✅ transient prop */
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
