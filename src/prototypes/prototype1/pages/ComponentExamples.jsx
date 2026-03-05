import { useState } from 'react';
import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
import Input, { Select, Textarea, Checkbox, Radio } from '../../../components/Input';
import Table from '../../../components/Table';
import Switch from '../../../components/Switch';
import Toggle, { ToggleGroup } from '../../../components/Toggle';
import Tooltip from '../../../components/Tooltip';
import Dialog from '../../../components/Dialog';
import Breadcrumb from '../../../components/Breadcrumb';
import Tabs from '../../../components/Tabs';
import { Icon } from '../../../icons/SailIcons';

// Reusable component section with code dialog
const ComponentSection = ({ title, children, code }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="max-w-[800px]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-body-large-emphasized text-default">{title}</h2>
        <button
          onClick={() => setShowCode(true)}
          className="text-body-small text-brand hover:text-button-primary-pressed transition-colors cursor-pointer flex items-center gap-1"
        >
          <Icon name="api" size="xsmall" />
          View code
        </button>
      </div>
      <div className="flex p-10 rounded-xl border border-border items-center justify-center">
        {children}
      </div>
      <Dialog
        open={showCode}
        onClose={() => setShowCode(false)}
        title={`${title} Code`}
        size="medium"
      >
        <div className="bg-offset p-5 rounded-lg overflow-x-auto">
          <pre className="text-label-small text-default font-mono whitespace-pre">{code}</pre>
        </div>
      </Dialog>
    </section>
  );
};

export default function ComponentExamples() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [textareaValue, setTextareaValue] = useState('');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [selectedCard, setSelectedCard] = useState('card1');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTabMd, setActiveTabMd] = useState('tab1');

  // Sample data for table
  const tableColumns = [
    { key: 'name', header: 'Name', width: 'grow' },
    { key: 'email', header: 'Email' },
    {
      key: 'status', header: 'Status', render: (item) => (
        <Badge variant={item.status === 'Active' ? 'success' : 'default'}>{item.status}</Badge>
      )
    },
    { key: 'amount', header: 'Amount', align: 'right' },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', amount: '$1,234.00' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', amount: '$567.00' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'Active', amount: '$890.00' },
  ];

  return (
    <div className="space-y-12">
      <ComponentSection
        title="Breadcrumb"
        code={`// With current page
<Breadcrumb
  pages={[
    { label: 'Home', to: '/' },
    { label: 'Connect', to: '/connect' },
  ]}
  currentPage="Connected accounts"
/>

// Without current page
<Breadcrumb
  pages={[
    { label: 'Home', to: '/' },
    { label: 'Connect', to: '/connect' },
  ]}
  showCurrentPage={false}
/>`}
      >
        <div className="flex flex-col gap-6">
          <Breadcrumb
            pages={[{ label: 'Page at the root', to: '/' }]}
            currentPage="The current page"
          />
          <Breadcrumb
            pages={[
              { label: 'Page at the root', to: '/' },
              { label: 'Page one level deep', to: '/' },
            ]}
            currentPage="The current page"
            showCurrentPage={false}
          />
        </div>
      </ComponentSection>

      <ComponentSection
        title="Tabs"
        code={`const tabs = [
  { key: 'tab1', label: 'Tab 1' },
  { key: 'tab2', label: 'Tab 2' },
  { key: 'tab3', label: 'Tab 3' },
];

// Sizes: sm, md (default), lg
<Tabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  size="md"
>
  {activeTab === 'tab1' && <div>Tab 1 content</div>}
  {activeTab === 'tab2' && <div>Tab 2 content</div>}
</Tabs>`}
      >
        <div className="w-full">
          <Tabs
            tabs={[
              { key: 'tab1', label: 'Tab 1' },
              { key: 'tab2', label: 'Tab 2' },
              { key: 'tab3', label: 'Tab 3' },
              { key: 'tab4', label: 'Tab 4' },
              { key: 'tab5', label: 'Tab 5' },
            ]}
            activeTab={activeTabMd}
            onTabChange={setActiveTabMd}
          >
            <p className="p-4 border border-border rounded-lg bg-offset text-body-small text-subdued">Content for {activeTabMd}</p>
          </Tabs>
        </div>
      </ComponentSection>

      <ComponentSection
        title="Badge"
        code={`<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </ComponentSection>

      <ComponentSection
        title="Button"
        code={`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button disabled>Disabled</Button>
<Button icon="add">With Icon</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>`}
      >
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button icon="add">With Icon</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </ComponentSection>

      <ComponentSection
        title="Input"
        code={`<Input
  label="Email address"
  description="We'll use this for notifications"
  placeholder="you@example.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
<Input label="Price" prefix="$" ... />
<Input error errorMessage="Already taken" ... />`}
      >
        <div className="space-y-4 max-w-sm">
          <Input
            label="Email address"
            description="We'll use this for account notifications"
            placeholder="you@example.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Price"
            placeholder="0.00"
            prefix="$"
            value=""
            onChange={() => { }}
          />
          <Input
            label="Username"
            placeholder="Choose a username"
            error
            errorMessage="This username is already taken"
            value=""
            onChange={() => { }}
          />
        </div>
      </ComponentSection>

      <ComponentSection
        title="Select"
        code={`<Select
  label="Country"
  description="Select your billing country"
  value={value}
  onChange={(e) => setValue(e.target.value)}
>
  <option value="us">United States</option>
</Select>

// Sizes: sm, md (default), lg
<Select size="sm">...</Select>
<Select size="lg">...</Select>`}
      >
        <div className="space-y-4 max-w-sm">
          <Select
            label="Country"
            description="Select your billing country"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option value="option1">United States</option>
            <option value="option2">Canada</option>
            <option value="option3">United Kingdom</option>
          </Select>
          <div className="flex flex-wrap items-center gap-3">
            <Select size="sm" value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
              <option value="option1">Small</option>
              <option value="option2">Option 2</option>
            </Select>
            <Select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
              <option value="option1">Medium</option>
              <option value="option2">Option 2</option>
            </Select>
            <Select size="lg" value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
              <option value="option1">Large</option>
              <option value="option2">Option 2</option>
            </Select>
          </div>
        </div>
      </ComponentSection>

      <ComponentSection
        title="Textarea"
        code={`<Textarea
  label="Message"
  description="Describe your issue in detail"
  placeholder="Enter your message..."
  rows={3}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`}
      >
        <div className="max-w-sm">
          <Textarea
            label="Message"
            description="Describe your issue in detail"
            placeholder="Enter your message..."
            rows={3}
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
        </div>
      </ComponentSection>

      <ComponentSection
        title="Switch"
        code={`<Switch
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="Enable notifications"
  description="Receive emails about activity"
/>
<Switch disabled label="Disabled" />`}
      >
        <div className="flex flex-col space-y-8">
          <Switch
            checked={switchChecked}
            onChange={(e) => setSwitchChecked(e.target.checked)}
            label="Enable notifications"
            description="Receive emails about account activity"
          />
          <Switch
            checked={false}
            onChange={() => { }}
            disabled
            label="Disabled switch"
          />
        </div>
      </ComponentSection>

      <ComponentSection
        title="Checkbox"
        code={`<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="Accept terms"
  description="I agree to the terms and conditions"
/>
<Checkbox disabled label="Disabled" />`}
      >
        <div className="flex flex-col space-y-4">
          <Checkbox
            checked={checkboxChecked}
            onChange={(e) => setCheckboxChecked(e.target.checked)}
            label="Accept terms"
            description="I agree to the terms and conditions"
          />
          <Checkbox
            checked={true}
            onChange={() => { }}
            label="Checked checkbox"
          />
          <Checkbox
            checked={false}
            onChange={() => { }}
            disabled
            label="Disabled checkbox"
          />
        </div>
      </ComponentSection>

      <ComponentSection
        title="Radio"
        code={`<Radio
  checked={selected === 'option1'}
  onChange={() => setSelected('option1')}
  name="plan"
  value="option1"
  label="Basic plan"
  description="$9/month"
/>
<Radio
  checked={selected === 'option2'}
  onChange={() => setSelected('option2')}
  name="plan"
  value="option2"
  label="Pro plan"
  description="$29/month"
/>`}
      >
        <div className="flex flex-col space-y-4">
          <Radio
            checked={selectedRadio === 'option1'}
            onChange={() => setSelectedRadio('option1')}
            name="plan"
            value="option1"
            label="Basic plan"
            description="$9/month - For individuals"
          />
          <Radio
            checked={selectedRadio === 'option2'}
            onChange={() => setSelectedRadio('option2')}
            name="plan"
            value="option2"
            label="Pro plan"
            description="$29/month - For small teams"
          />
          <Radio
            checked={selectedRadio === 'option3'}
            onChange={() => setSelectedRadio('option3')}
            name="plan"
            value="option3"
            label="Enterprise"
            description="Custom pricing"
          />
        </div>
      </ComponentSection>

      <ComponentSection
        title="Toggle"
        code={`<ToggleGroup label="Select an option">
  <Toggle
    title="Option A"
    description="This is the first option"
    selected={selected === 'a'}
    onClick={() => setSelected('a')}
  />
  <Toggle
    title="Option B"
    description="This is the second option"
    selected={selected === 'b'}
    onClick={() => setSelected('b')}
  />
</ToggleGroup>`}
      >
        <div className="max-w-sm">
          <ToggleGroup label="Select an option">
            <Toggle
              title="Option A"
              description="This is the first option"
              selected={selectedCard === 'card1'}
              onClick={() => setSelectedCard('card1')}
            />
            <Toggle
              title="Option B"
              description="This is the second option"
              selected={selectedCard === 'card2'}
              onClick={() => setSelectedCard('card2')}
            />
          </ToggleGroup>
        </div>
      </ComponentSection>

      <ComponentSection
        title="Tooltip"
        code={`<Tooltip content="Tooltip text" placement="top">
  <Button>Hover me</Button>
</Tooltip>

// Placements: top, bottom
// Variants: default, minimal
<Tooltip variant="minimal" ...>`}
      >
        <div className="flex flex-wrap gap-4">
          <Tooltip content="This is a tooltip on top" placement="top">
            <Button variant="secondary">Hover me (top)</Button>
          </Tooltip>
          <Tooltip content="This is a tooltip on bottom" placement="bottom">
            <Button variant="secondary">Hover me (bottom)</Button>
          </Tooltip>
          <Tooltip content="Minimal style" placement="top" variant="minimal">
            <Button variant="secondary">Minimal tooltip</Button>
          </Tooltip>
        </div>
      </ComponentSection>

      <ComponentSection
        title="Dialog"
        code={`<Dialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  title="Dialog Title"
  subtitle="Optional subtitle text"
  size="medium" // small | medium | large | xlarge | full
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  }
>
  Dialog content goes here
</Dialog>`}
      >
        <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
      </ComponentSection>

      <ComponentSection
        title="Table"
        code={`const columns = [
  { key: 'name', header: 'Name', width: 'grow' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status',
    render: (item) => <Badge>{item.status}</Badge> },
  { key: 'amount', header: 'Amount', align: 'right' },
];

<Table
  columns={columns}
  data={data}
  onRowClick={(item) => console.log(item)}
/>`}
      >
        <div className="w-full">
          <Table
            columns={tableColumns}
            data={tableData}
            onRowClick={(item) => alert(`Clicked: ${item.name}`)}
          />
        </div>
      </ComponentSection>

      {/* Dialog instance */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm Action"
        subtitle="This action cannot be undone."
        size="medium"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </div>
        }
      >
        <p className="text-body-small text-subdued">
          Are you sure you want to proceed? This will permanently delete the selected items.
        </p>
      </Dialog>
    </div>
  );
}
