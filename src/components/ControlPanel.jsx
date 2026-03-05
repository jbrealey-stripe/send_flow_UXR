import { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '../icons/SailIcons';
import Dialog from './Dialog';

// --- Primitives ---

export const ControlPanelButton = ({ onClick, active, className, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-label-medium rounded-lg w-full bg-button-secondary-bg hover:bg-button-secondary-bg-hover border border-border cursor-pointer transition-colors ${active
      ? 'bg-button-primary-bg text-button-primary-text'
      : 'text-default hover:bg-offset'
      } ${className || ''}`}
  >
    {children}
  </button>
);

export const ControlPanelHeader = ({ minimized, onToggle }) => (
  <div
    onClick={onToggle}
    className="flex items-center justify-between gap-4 px-3 py-2 cursor-pointer transition-colors hover:bg-offset"
  >
    <span className="text-label-medium-emphasized text-default">
      Prototype controls
    </span>
    <button className="text-icon-default hover:text-icon-subdued cursor-pointer transition-colors">
      <Icon name="chevronDown" size="xxsmall" fill="currentColor" className={`w-[8px] h-[8px] transition-transform ${minimized ? 'rotate-180' : ''}`} />
    </button>
  </div>
);

export const ControlPanelBody = ({ minimized, children }) => (
  <div
    className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${minimized ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
  >
    <div className="overflow-hidden w-full">
      <div className="flex flex-col w-full items-center gap-2.5 px-3 py-3 text-icon-default">
        {children}
      </div>
    </div>
  </div>
);

// --- Drag constants ---

export const MARGIN = 8;
export const PANEL_WIDTH = 230;

export const DropZone = ({ snapSide, panelRef }) => {
  const height = panelRef.current?.offsetHeight || 40;
  const isLeftActive = snapSide === 'left';

  const shared = { bottom: MARGIN, width: PANEL_WIDTH, height, position: 'fixed' };

  return (
    <>
      {/* Left drop zone */}
      <div
        className={`z-[99] rounded-lg transition-all duration-200 ${isLeftActive
          ? 'border-2 border-brand bg-brand/5'
          : 'border-2 border-border bg-offset/40 border-dotted'
          }`}
        style={{ ...shared, left: MARGIN, right: 'auto' }}
      />
      {/* Right drop zone */}
      <div
        className={`z-[99] rounded-lg transition-all duration-200 ${!isLeftActive
          ? 'border-2 border-brand bg-brand/5'
          : 'border-2 border-border bg-offset/40 border-dotted'
          }`}
        style={{ ...shared, right: MARGIN, left: 'auto' }}
      />
    </>
  );
};

export function useDragSnap() {
  const panelRef = useRef(null);
  const [side, setSide] = useState('right');
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false); // animating to snap position via left
  const [settlePos, setSettlePos] = useState(null); // { left, bottom } target for settle animation
  const [dragPos, setDragPos] = useState(null); // { left, bottom } during drag
  const [snapTarget, setSnapTarget] = useState('right');
  const dragStart = useRef(null);
  const didDrag = useRef(false);

  const getSnapSide = (left) => {
    const panelCenter = left + PANEL_WIDTH / 2;
    const contentWidth = document.documentElement.clientWidth;
    return panelCenter < contentWidth / 2 ? 'left' : 'right';
  };

  const getSnapLeft = (s) => {
    const contentWidth = document.documentElement.clientWidth;
    return s === 'left' ? MARGIN : contentWidth - PANEL_WIDTH - MARGIN;
  };

  const onPointerDown = useCallback((e) => {
    if (e.target.closest('button, input, label, [role="switch"]')) return;

    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      panelLeft: rect.left,
      panelBottom: window.innerHeight - rect.bottom,
    };
    didDrag.current = false;
    setSettling(false);
    setDragging(true);
    setDragPos({ left: rect.left, bottom: window.innerHeight - rect.bottom });
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (e) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.pointerX;
      const dy = e.clientY - dragStart.current.pointerY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        didDrag.current = true;
      }
      const newLeft = dragStart.current.panelLeft + dx;
      const newBottom = dragStart.current.panelBottom - dy;
      setDragPos({ left: newLeft, bottom: newBottom });
      setSnapTarget(getSnapSide(newLeft));
    };

    const onPointerUp = () => {
      if (didDrag.current) {
        const newSide = snapTarget;
        setSide(newSide);
        // Animate to snap position using left, then switch to right/left CSS after
        setSettlePos({ left: getSnapLeft(newSide), bottom: MARGIN });
        setSettling(true);
      }
      setDragging(false);
      setDragPos(null);
      dragStart.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragging, snapTarget]);

  // After settle animation completes, switch to CSS right/left resting position
  useEffect(() => {
    if (!settling) return;
    const timer = setTimeout(() => setSettling(false), 250);
    return () => clearTimeout(timer);
  }, [settling]);

  return { side, dragging, settling, settlePos, dragPos, snapTarget, panelRef, onPointerDown, didDrag };
}

// --- Sections (add your own controls here) ---

export const InfoBanner = () => (
  <div className="flex flex-col gap-2 w-full p-3 bg-offset rounded-lg">
    <p className="text-body-small text-subdued">Use this space to add controls for your prototype. You can also drag the panel to other side!</p>
  </div>
);

export const ContextDialog = ({ open, onClose, children }) => (
  <Dialog
    open={open}
    onClose={onClose}
    title="Project context"
    subtitle="Add context about your prototype for viewers."
    size="full"
    overlayClassName="z-[101]"
  >
    {children || (
      <div className="flex gap-4 w-full bg-offset rounded-lg mx-auto px-4 py-32">
        <p className="text-body-medium text-subdued max-w-[700px] mx-auto text-center">
          Use this dialog to share context about the project or work shown in this prototype. You can describe the problem being solved, the target audience, key decisions, or anything else that helps viewers understand what they're looking at.
        </p>
      </div>
    )}
  </Dialog>
);
