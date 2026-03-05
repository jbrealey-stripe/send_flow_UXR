const sizes = {
  sm: 'text-label-small px-2 py-1 mb-1',
  md: 'text-label-medium px-2.5 py-1.5 mb-1',
  lg: 'text-label-large px-3 py-2 mb-1',
};

const Tab = ({ label, active, onClick, size = 'md', isFirst = false }) => (
  <button
    onClick={onClick}
    className={`relative text-label-medium-emphasized cursor-pointer rounded-lg shrink-0 whitespace-nowrap transition-colors ${sizes[size]} ${isFirst ? 'ml-[-8px]' : ''} ${active ? 'text-brand hover:bg-brand/10' : 'text-subdued hover:text-default hover:bg-offset'
      }`}
  >
    {label}
    {active && (
      <span className={`absolute bottom-[-5px] left-2.5 right-2.5 bg-brand h-[2px]`} />
    )}
  </button>
);

const Tabs = ({ tabs, activeTab, onTabChange, size = 'md', children }) => {
  return (
    <div>
      <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.key}
            label={tab.label}
            active={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
            size={size}
            isFirst={index === 0}
          />
        ))}
      </div>
      {children && <div className="pt-4">{children}</div>}
    </div>
  );
};

export default Tabs;
