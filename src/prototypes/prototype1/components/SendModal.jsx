import { useState, useRef, useEffect } from 'react'
import { Icon } from '../../../icons/SailIcons'
import { toRecipientFromModal, usePayouts } from '../PayoutsContext'

const fromAccounts = [
  { id: 'usd', name: 'Financial account', currency: 'USD', symbol: '$', balance: 224858.99, flag: '🇺🇸' },
  { id: 'eur', name: 'Financial account', currency: 'EUR', symbol: '€', balance: 84.82, flag: '🇪🇺' },
  { id: 'gbp', name: 'Financial account', currency: 'GBP', symbol: '£', balance: 73.17, flag: '🇬🇧' },
  { id: 'usdc', name: 'Financial account', currency: 'USDC', symbol: '$', balance: 24883.00, flag: '🪙' },
]

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', exchangeRate: 1.00 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£', exchangeRate: 0.74 },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR', currencySymbol: '€', exchangeRate: 0.85 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', currencySymbol: 'C$', exchangeRate: 1.36 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', currencySymbol: 'A$', exchangeRate: 1.53 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', currencySymbol: '¥', exchangeRate: 149.50 },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', currencySymbol: '₹', exchangeRate: 83.12 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', currencySymbol: 'MX$', exchangeRate: 17.15 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$', exchangeRate: 4.97 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', currencySymbol: 'S$', exchangeRate: 1.34 },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', currencySymbol: 'HK$', exchangeRate: 7.82 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', currencySymbol: 'CHF', exchangeRate: 0.88 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: 'SEK', currencySymbol: 'kr', exchangeRate: 10.45 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', currencySymbol: 'NZ$', exchangeRate: 1.67 },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'KRW', currencySymbol: '₩', exchangeRate: 1320.50 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', currencySymbol: '₱', exchangeRate: 56.20 },
]

const networks = [
  { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0' },
  { id: 'avalanche', name: 'Avalanche C-Chain', color: '#E84142' },
  { id: 'base', name: 'Base', color: '#0052FF' },
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'optimism', name: 'Optimism', color: '#FF0420' },
  { id: 'polygon', name: 'Polygon', color: '#8247E5' },
  { id: 'noble', name: 'Noble', color: '#000000' },
  { id: 'solana', name: 'Solana', color: '#9945FF' },
  { id: 'stellar', name: 'Stellar', color: '#000000' },
]

const recipients = [
  { name: 'Albert Chin', email: 'albertc@company.com' },
  { name: 'Lulu Siegel', email: 'lulu@sample.com' },
  { name: 'Bianca Silverstein', email: 'bianca@sample.com' },
  { name: 'Bradley Copperfield', email: 'bradleycop@company.com' },
  { name: 'Clay Thompson', email: 'cthom@sample.com' },
  { name: 'Nadia Kowalski', email: 'nadia@company.com' },
]

function NetworkIcon({ id, size = 24 }) {
  const r = size / 2
  const icons = {
    arbitrum: { bg: '#28A0F0', letter: 'A' },
    avalanche: { bg: '#E84142', letter: 'A' },
    base: { bg: '#0052FF', letter: '—' },
    ethereum: { bg: '#627EEA', letter: '◆' },
    optimism: { bg: '#FF0420', letter: 'OP' },
    polygon: { bg: '#8247E5', letter: 'P' },
    noble: { bg: '#000000', letter: 'T' },
    solana: { bg: '#9945FF', letter: 'S' },
    stellar: { bg: '#000000', letter: 'S' },
  }
  const icon = icons[id] || { bg: '#6b7280', letter: '?' }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" className="shrink-0">
      <rect width={size} height={size} rx={size * 0.2} fill={icon.bg} />
      <text x={r} y={r} dominantBaseline="central" textAnchor="middle" fill="white" fontSize={icon.letter.length > 1 ? size * 0.32 : size * 0.45} fontWeight="bold" fontFamily="system-ui">{icon.letter}</text>
    </svg>
  )
}

export default function SendModal({ open, onClose, onPayoutCreated, onRecipientCreated, initialRecipient }) {
  const { variant, userRecipients } = usePayouts();
  const visibleRecipients = variant === 'new-user'
    ? [...userRecipients]
    : [
      ...userRecipients.filter((ur) => !recipients.some((r) => r.email === ur.email)),
      ...recipients,
    ];
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [modalStep, setModalStep] = useState('choose-recipient')
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [recipientSearch, setRecipientSearch] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [businessType, setBusinessType] = useState(null)
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false)
  const [legalFirstName, setLegalFirstName] = useState('')
  const [legalLastName, setLegalLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [editingField, setEditingField] = useState('send') // 'send' or 'receive'
  const [showCalendar, setShowCalendar] = useState(false)
  const [isCalendarClosing, setIsCalendarClosing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [calendarSlideDirection, setCalendarSlideDirection] = useState(null)
  const [repeatPayout, setRepeatPayout] = useState(false)
  const [notifyRecipient, setNotifyRecipient] = useState(true)
  const [isPayrollPayment, setIsPayrollPayment] = useState(false)
  const [internalNote, setInternalNote] = useState('')
  const [statementDescriptor, setStatementDescriptor] = useState('')
  const [selectedCadence, setSelectedCadence] = useState(null)
  const [showCadenceDropdown, setShowCadenceDropdown] = useState(false)
  const [customCadence, setCustomCadence] = useState(false)
  const [isCustomCadenceClosing, setIsCustomCadenceClosing] = useState(false)
  const [repeatEveryNumber, setRepeatEveryNumber] = useState('1')
  const [repeatEveryPeriod, setRepeatEveryPeriod] = useState('Weeks')
  const [showRepeatNumberDropdown, setShowRepeatNumberDropdown] = useState(false)
  const [showRepeatPeriodDropdown, setShowRepeatPeriodDropdown] = useState(false)
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([])
  const [lastInstanceDate, setLastInstanceDate] = useState(null)
  const [showFirstInstanceCalendar, setShowFirstInstanceCalendar] = useState(false)
  const [isFirstInstanceCalendarClosing, setIsFirstInstanceCalendarClosing] = useState(false)
  const [firstInstanceCalendarMonth, setFirstInstanceCalendarMonth] = useState(new Date().getMonth())
  const [firstInstanceCalendarYear, setFirstInstanceCalendarYear] = useState(new Date().getFullYear())
  const [showLastInstanceCalendar, setShowLastInstanceCalendar] = useState(false)
  const [isLastInstanceCalendarClosing, setIsLastInstanceCalendarClosing] = useState(false)
  const [lastInstanceCalendarMonth, setLastInstanceCalendarMonth] = useState(new Date().getMonth())
  const [lastInstanceCalendarYear, setLastInstanceCalendarYear] = useState(new Date().getFullYear())
  const [isExistingRecipient, setIsExistingRecipient] = useState(false)
  const [selectedRecipientName, setSelectedRecipientName] = useState('')
  const [viewWithFX, setViewWithFX] = useState(false)
  const [withNACHA, setWithNACHA] = useState(false)
  const [showFXDetails, setShowFXDetails] = useState(false)
  const [recipientCountry, setRecipientCountry] = useState('US')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countryDropdownPos, setCountryDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('base')
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [emailNoteToRecipient, setEmailNoteToRecipient] = useState('')
  const [emailPhoneNumber, setEmailPhoneNumber] = useState('')
  const [emailPayoutMethods, setEmailPayoutMethods] = useState({ bank: true, debit: false, stablecoin: false })
  const [emailPreviewTab, setEmailPreviewTab] = useState('email')
  const [selectedFromAccount, setSelectedFromAccount] = useState('usd')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [fromDropdownPos, setFromDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [isContentOverflowing, setIsContentOverflowing] = useState(false)
  const [isAddRecipientOverflowing, setIsAddRecipientOverflowing] = useState(false)
  const confirmScrollRef = useRef(null)
  const addRecipientScrollRef = useRef(null)
  const countryDropdownRef = useRef(null)
  const fromDropdownRef = useRef(null)
  const addRecipientCountryRef = useRef(null)

  // Pre-select recipient if provided
  useEffect(() => {
    if (open && initialRecipient) {
      setIsExistingRecipient(true)
      setSelectedRecipientName(initialRecipient.name)
      setRecipientEmail(initialRecipient.email)
      setSelectedMethod('ach')
      setAccountNumber(initialRecipient.last4 || '6789')
      setRecipientCountry(initialRecipient.country || 'US')
      setModalStep('confirm')
    }
  }, [open, initialRecipient])

  // Check if content is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (confirmScrollRef.current) {
        const { scrollHeight, clientHeight } = confirmScrollRef.current
        setIsContentOverflowing(scrollHeight > clientHeight)
      }
      if (addRecipientScrollRef.current) {
        const { scrollHeight, clientHeight } = addRecipientScrollRef.current
        setIsAddRecipientOverflowing(scrollHeight > clientHeight)
      }
    }
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [modalStep, viewWithFX, showFXDetails])

  const resetModalForm = () => {
    setModalStep('choose-recipient')
    setSelectedMethod(null)
    setRecipientSearch('')
    setRecipientEmail('')
    setBusinessType(null)
    setShowBusinessTypeDropdown(false)
    setLegalFirstName('')
    setLegalLastName('')
    setBusinessName('')
    setSelectedFromAccount('usd')
    setShowFromDropdown(false)
    setRoutingNumber('')
    setAccountNumber('')
    setConfirmAccountNumber('')
    setWalletAddress('')
    setSelectedNetwork('base')
    setShowNetworkDropdown(false)
    setPayoutAmount('')
    setShowCalendar(false)
    setIsCalendarClosing(false)
    setSelectedDate(new Date())
    setCalendarMonth(new Date().getMonth())
    setCalendarYear(new Date().getFullYear())
    setCalendarSlideDirection(null)
    setRepeatPayout(false)
    setNotifyRecipient(true)
    setIsPayrollPayment(false)
    setInternalNote('')
    setStatementDescriptor('')
    setSelectedCadence(null)
    setShowCadenceDropdown(false)
    setCustomCadence(false)
    setIsCustomCadenceClosing(false)
    setRepeatEveryNumber('1')
    setRepeatEveryPeriod('Weeks')
    setShowRepeatNumberDropdown(false)
    setShowRepeatPeriodDropdown(false)
    setSelectedDaysOfWeek([])
    setLastInstanceDate(null)
    setShowFirstInstanceCalendar(false)
    setIsFirstInstanceCalendarClosing(false)
    setFirstInstanceCalendarMonth(new Date().getMonth())
    setFirstInstanceCalendarYear(new Date().getFullYear())
    setShowLastInstanceCalendar(false)
    setIsLastInstanceCalendarClosing(false)
    setLastInstanceCalendarMonth(new Date().getMonth())
    setLastInstanceCalendarYear(new Date().getFullYear())
    setIsExistingRecipient(false)
    setSelectedRecipientName('')
    setEmailNoteToRecipient('')
    setEmailPhoneNumber('')
    setEmailPayoutMethods({ bank: true, debit: false, stablecoin: false })
    setEmailPreviewTab('email')
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canContinue = isValidEmail(recipientEmail) && selectedMethod !== null

  const canContinueBusinessType = businessType !== null && (
    (businessType === 'company' && businessName.trim() !== '') ||
    (businessType === 'individual' && legalFirstName.trim() !== '' && legalLastName.trim() !== '')
  )

  const canContinueBankDetails = selectedMethod === 'stablecoin'
    ? walletAddress.trim() !== ''
    : routingNumber.trim() !== '' &&
      accountNumber.trim() !== '' &&
      confirmAccountNumber.trim() !== ''

  const canContinueConfirm = payoutAmount.trim() !== '' && parseFloat(payoutAmount) > 0

  const selectedCountry = countries.find(c => c.code === recipientCountry) || countries[0]
  const fromAccount = fromAccounts.find(a => a.id === selectedFromAccount) || fromAccounts[0]

  const getFee = () => {
    if (selectedMethod === 'email') return 1.00
    if (selectedMethod === 'ach') return 1.50
    if (selectedMethod === 'wire') return 25.00
    if (selectedMethod === 'stablecoin') return 1.50
    return 0
  }

  const getPayoutAmountNum = () => parseFloat(payoutAmount) || 0
  const getFxFee = () => recipientCountry !== 'US' ? getPayoutAmountNum() * 0.01 : 0
  const getTheyReceive = () => {
    if (recipientCountry === 'US') return getPayoutAmountNum()
    return getPayoutAmountNum() * selectedCountry.exchangeRate
  }
  const getTotalPay = () => getPayoutAmountNum() + getFee() + getFxFee()

  const formatCurrency = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear()
  }

  const isSelected = (day) => {
    return day === selectedDate.getDate() && calendarMonth === selectedDate.getMonth() && calendarYear === selectedDate.getFullYear()
  }

  const isPastDay = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(calendarYear, calendarMonth, day)
    return checkDate < today
  }

  const isBeyondMaxDay = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 180)
    const checkDate = new Date(calendarYear, calendarMonth, day)
    return checkDate > maxDate
  }

  const closeCalendar = () => {
    setIsCalendarClosing(true)
    setTimeout(() => {
      setShowCalendar(false)
      setIsCalendarClosing(false)
    }, 150)
  }

  const handleDateSelect = (day) => {
    setSelectedDate(new Date(calendarYear, calendarMonth, day))
    closeCalendar()
  }

  const prevMonth = () => {
    setCalendarSlideDirection('right')
    setTimeout(() => {
      if (calendarMonth === 0) {
        setCalendarMonth(11)
        setCalendarYear(calendarYear - 1)
      } else {
        setCalendarMonth(calendarMonth - 1)
      }
      setCalendarSlideDirection(null)
    }, 10)
  }

  const nextMonth = () => {
    setCalendarSlideDirection('left')
    setTimeout(() => {
      if (calendarMonth === 11) {
        setCalendarMonth(0)
        setCalendarYear(calendarYear + 1)
      } else {
        setCalendarMonth(calendarMonth + 1)
      }
      setCalendarSlideDirection(null)
    }, 10)
  }

  const formatSelectedDate = () => {
    const today = new Date()
    if (selectedDate.toDateString() === today.toDateString()) {
      return 'Now'
    }
    return selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // First instance calendar helpers
  const closeFirstInstanceCalendar = () => {
    setIsFirstInstanceCalendarClosing(true)
    setTimeout(() => {
      setShowFirstInstanceCalendar(false)
      setIsFirstInstanceCalendarClosing(false)
    }, 150)
  }

  const handleFirstInstanceDateSelect = (day) => {
    setSelectedDate(new Date(firstInstanceCalendarYear, firstInstanceCalendarMonth, day))
    if (lastInstanceDate && lastInstanceDate < new Date(firstInstanceCalendarYear, firstInstanceCalendarMonth, day)) {
      setLastInstanceDate(null)
    }
    closeFirstInstanceCalendar()
  }

  const prevFirstInstanceMonth = () => {
    if (firstInstanceCalendarMonth === 0) {
      setFirstInstanceCalendarMonth(11)
      setFirstInstanceCalendarYear(firstInstanceCalendarYear - 1)
    } else {
      setFirstInstanceCalendarMonth(firstInstanceCalendarMonth - 1)
    }
  }

  const nextFirstInstanceMonth = () => {
    if (firstInstanceCalendarMonth === 11) {
      setFirstInstanceCalendarMonth(0)
      setFirstInstanceCalendarYear(firstInstanceCalendarYear + 1)
    } else {
      setFirstInstanceCalendarMonth(firstInstanceCalendarMonth + 1)
    }
  }

  const isFirstInstancePastDay = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(firstInstanceCalendarYear, firstInstanceCalendarMonth, day)
    return checkDate < today
  }

  const isFirstInstanceSelected = (day) => {
    return day === selectedDate.getDate() && firstInstanceCalendarMonth === selectedDate.getMonth() && firstInstanceCalendarYear === selectedDate.getFullYear()
  }

  const isFirstInstanceToday = (day) => {
    const today = new Date()
    return day === today.getDate() && firstInstanceCalendarMonth === today.getMonth() && firstInstanceCalendarYear === today.getFullYear()
  }

  // Last instance calendar helpers
  const closeLastInstanceCalendar = () => {
    setIsLastInstanceCalendarClosing(true)
    setTimeout(() => {
      setShowLastInstanceCalendar(false)
      setIsLastInstanceCalendarClosing(false)
    }, 150)
  }

  const handleLastInstanceDateSelect = (day) => {
    setLastInstanceDate(new Date(lastInstanceCalendarYear, lastInstanceCalendarMonth, day))
    closeLastInstanceCalendar()
  }

  const prevLastInstanceMonth = () => {
    if (lastInstanceCalendarMonth === 0) {
      setLastInstanceCalendarMonth(11)
      setLastInstanceCalendarYear(lastInstanceCalendarYear - 1)
    } else {
      setLastInstanceCalendarMonth(lastInstanceCalendarMonth - 1)
    }
  }

  const nextLastInstanceMonth = () => {
    if (lastInstanceCalendarMonth === 11) {
      setLastInstanceCalendarMonth(0)
      setLastInstanceCalendarYear(lastInstanceCalendarYear + 1)
    } else {
      setLastInstanceCalendarMonth(lastInstanceCalendarMonth + 1)
    }
  }

  const isLastInstanceDisabledDay = (day) => {
    const checkDate = new Date(lastInstanceCalendarYear, lastInstanceCalendarMonth, day)
    checkDate.setHours(0, 0, 0, 0)
    const firstInstance = new Date(selectedDate)
    firstInstance.setHours(0, 0, 0, 0)
    return checkDate <= firstInstance
  }

  const isLastInstanceSelected = (day) => {
    if (!lastInstanceDate) return false
    return day === lastInstanceDate.getDate() && lastInstanceCalendarMonth === lastInstanceDate.getMonth() && lastInstanceCalendarYear === lastInstanceDate.getFullYear()
  }

  const isLastInstanceCurrentMonth = () => {
    return lastInstanceCalendarMonth === selectedDate.getMonth() && lastInstanceCalendarYear === selectedDate.getFullYear()
  }

  const closeSendModal = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalClosing(false)
      resetModalForm()
      document.body.style.overflow = ''
      if (onClose) onClose()
    }, 200)
  }

  const createScheduledPayout = () => {
    const newPayout = {
      id: `po_${Date.now()}`,
      amount: getPayoutAmountNum(),
      recipientName: isExistingRecipient ? selectedRecipientName : businessType === 'individual' ? `${legalFirstName} ${legalLastName}` : (businessName || 'Company'),
      recipientEmail: recipientEmail || 'mkerr@company.com',
      method: selectedMethod,
      status: 'Initiated',
      initiatesOn: new Date(selectedDate),
      accountLast4: accountNumber.slice(-4) || '1234',
      fee: getFee(),
      internalNote: internalNote,
      statementDescriptor: statementDescriptor,
      isRepeating: repeatPayout,
      cadence: selectedCadence,
      endsOn: lastInstanceDate,
      currency: 'USD',
    }
    if (onPayoutCreated) onPayoutCreated(newPayout)
    if (!isExistingRecipient && onRecipientCreated) {
      onRecipientCreated(toRecipientFromModal({
        email: recipientEmail,
        country: recipientCountry,
        businessType,
        legalFirstName,
        legalLastName,
        businessName,
        method: selectedMethod,
        routingNumber,
        accountNumber,
        walletAddress,
        selectedNetwork,
      }))
    }
  }

  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isModalClosing ? 'animate-[fadeOut_0.2s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}>
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(192, 200, 210, 0.7)' }}
        onClick={() => modalStep === 'choose-recipient' ? closeSendModal() : setShowExitConfirm(true)}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-out ${isModalClosing ? 'animate-[slideDown_0.2s_ease-out]' : 'animate-[slideUp_0.2s_ease-out]'} ${modalStep === 'email-config' ? 'w-[950px] h-[600px]' : modalStep === 'business-type' || modalStep === 'bank-details' || modalStep === 'confirm' || modalStep === 'repeat-config' || modalStep === 'summary' ? 'w-[960px] h-[600px]' : modalStep === 'add-recipient' ? 'w-[500px] h-[600px]' : modalStep === 'success' ? 'w-[480px]' : 'w-[400px] max-h-[80vh] overflow-y-auto'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4">
          <div className="flex items-center gap-2">
            <Icon name="send" size="small" fill="#374151" />
            <h2 className="text-sm font-semibold text-gray-900">Send</h2>
          </div>
          <button
            onClick={() => modalStep === 'choose-recipient' ? closeSendModal() : setShowExitConfirm(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon name="close" size="small" fill="currentColor" />
          </button>
        </div>

        {/* Content */}
        {modalStep === 'choose-recipient' && (
          <div className="px-5 pb-5 animate-[slideInLeft_0.3s_ease-out]">
            <p className="text-sm text-gray-500 mb-4">Choose recipient</p>

            {/* Search input */}
            <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg mb-4">
              <Icon name="search" size="small" fill="#9ca3af" />
              <input
                type="text"
                placeholder="Search by name, email, or Stripe account"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && recipientSearch.trim()) {
                    setRecipientEmail(recipientSearch.trim())
                    setModalStep('add-recipient')
                  }
                }}
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Add new recipient */}
            <button
              onClick={() => {
                if (recipientSearch.trim()) {
                  setRecipientEmail(recipientSearch.trim())
                }
                setModalStep('add-recipient')
              }}
              className="flex items-center justify-between w-full py-3 mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon name="add" size="small" fill="#6366f1" />
                </div>
                <span className="text-indigo-600 font-medium text-sm">Add new recipient</span>
              </div>
              <Icon name="chevronRight" size="small" fill="#6366f1" />
            </button>

            {/* Recipients list */}
            <div className="space-y-1">
              {visibleRecipients.map((recipient) => {
                const isUserAdded = userRecipients.some((ur) => ur.email === recipient.email)
                const countryCode = recipient.destination?.countryCode || 'US'
                const last4 = recipient.destination?.last4 || '6789'
                const method = recipient.payoutMethods?.find((m) => m.enabled)?.name?.toLowerCase() || 'ach'
                return (
                  <button
                    key={recipient.email}
                    onClick={() => {
                      setIsExistingRecipient(true)
                      setSelectedRecipientName(recipient.name)
                      setRecipientEmail(recipient.email)
                      setSelectedMethod(method === 'stablecoin' ? 'stablecoin' : method === 'wire' ? 'wire' : 'ach')
                      setAccountNumber(last4)
                      setRecipientCountry(countryCode)
                      setModalStep('confirm')
                    }}
                    className="flex flex-col items-start w-full py-[3px] hover:bg-gray-50 rounded-lg px-2 -mx-2 text-left"
                  >
                    <span className="text-sm font-medium text-gray-900">{recipient.email}</span>
                    <span className="text-xs text-gray-400">{recipient.name && recipient.name !== '—' ? recipient.name : '—'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {modalStep === 'add-recipient' && (
          <div
            className="flex flex-col h-[calc(100%-60px)] animate-[slideInRight_0.3s_ease-out]"
            onKeyDown={(e) => e.key === 'Enter' && canContinue && setModalStep(selectedMethod === 'email' ? 'email-config' : 'business-type')}
          >
            {/* Scrollable content */}
            <div ref={addRecipientScrollRef} className="flex-1 px-5 overflow-y-auto">
              {/* Email input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 mb-1">Recipient's email adress</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                />
              </div>

              {/* Country select */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 mb-1">Recipient's country</label>
                <div
                  ref={addRecipientCountryRef}
                  onClick={() => {
                    if (!showCountryDropdown && addRecipientCountryRef.current) {
                      const rect = addRecipientCountryRef.current.getBoundingClientRect()
                      setCountryDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
                    }
                    setShowCountryDropdown(!showCountryDropdown)
                  }}
                  className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-sm text-gray-900">{selectedCountry.name}</span>
                  </div>
                  <Icon name="chevronDown" size="small" fill="#6b7280" />
                </div>
              </div>

              {/* Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Method</label>
                <div className="space-y-3">
                  {/* Pay via email */}
                  <div
                    onClick={() => setSelectedMethod('email')}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === 'email'
                        ? 'border-indigo-500 border-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 shrink-0" style={{ width: 12, height: 12 }}>
                        <Icon name="send" size="xxsmall" fill={selectedMethod === 'email' ? '#6366f1' : '#6b7280'} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Pay via email</div>
                        <div className="text-[12px] text-gray-500">Arrival time depends on the transfer method · Fee starts at US$1.50 · Stripe will collect payout details from your recipient</div>
                      </div>
                    </div>
                  </div>

                  {/* Standard transfer */}
                  <div
                    onClick={() => setSelectedMethod('ach')}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === 'ach'
                        ? 'border-indigo-500 border-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 shrink-0" style={{ width: 12, height: 12 }}>
                        <Icon name="bank" size="xxsmall" fill={selectedMethod === 'ach' ? '#6366f1' : '#6b7280'} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Standard transfer</div>
                        <div className="text-[12px] text-gray-500">Arrives in 2–3 business days · US$1.50 fee · You will provide payout and business details in the next step</div>
                      </div>
                    </div>
                  </div>

                  {/* Wire transfer */}
                  <div
                    onClick={() => setSelectedMethod('wire')}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === 'wire'
                        ? 'border-indigo-500 border-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 shrink-0" style={{ width: 12, height: 12 }}>
                        <Icon name="bank" size="xxsmall" fill={selectedMethod === 'wire' ? '#6366f1' : '#6b7280'} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Wire transfer</div>
                        <div className="text-[12px] text-gray-500">Arrives in 1 business day · US$25.00 fee · You will provide payout and business details in the next step</div>
                      </div>
                    </div>
                  </div>
                  {/* Stablecoin transfer */}
                  <div
                    onClick={() => setSelectedMethod('stablecoin')}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === 'stablecoin'
                        ? 'border-indigo-500 border-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <svg className="mt-1.5 shrink-0" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={selectedMethod === 'stablecoin' ? '#6366f1' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="8" r="6.5" />
                        <path d="M10 6.5C9.7 5.6 8.9 5 8 5C6.9 5 6 5.9 6 7s.9 2 2 2c1.1 0 2 .9 2 2s-.9 2-2 2c-.9 0-1.7-.6-2-1.5" />
                        <line x1="8" y1="3.5" x2="8" y2="5" />
                        <line x1="8" y1="11" x2="8" y2="12.5" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Stablecoin transfer (USDC)</div>
                        <div className="text-[12px] text-gray-500">Arrives in seconds · Up to US$1.50 fee · You will provide payout and business details in the next step</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons - sticky at bottom */}
            <div className="flex justify-end gap-3 px-5 pb-4 pt-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setModalStep('choose-recipient')}
                className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                disabled={!canContinue}
                onClick={() => canContinue && setModalStep(selectedMethod === 'email' ? 'email-config' : 'business-type')}
                className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  canContinue
                    ? 'bg-indigo-500 hover:bg-indigo-600'
                    : 'bg-indigo-300 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {modalStep === 'email-config' && (
          <div
            className="flex flex-col h-[calc(100%-60px)] animate-[slideInRight_0.3s_ease-out]"
            onKeyDown={(e) => e.key === 'Enter' && setModalStep('confirm')}
          >
            <div className="flex flex-1 min-h-0">
              {/* Left side - Form */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 px-5 overflow-y-auto">
                  {/* How does this work */}
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">How does this work?</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed">Stripe will send an email to your recipient to securely gather their bank details and select the payout method that best suits their needs.</p>
                  </div>

                  {/* Note to recipient */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-sm font-medium text-gray-900">Note to recipient</label>
                      <span className="text-[12px] text-gray-400">Optional</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Note"
                        value={emailNoteToRecipient}
                        onChange={(e) => e.target.value.length <= 50 && setEmailNoteToRecipient(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300 pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">{emailNoteToRecipient.length}/50</span>
                    </div>
                  </div>

                  {/* Phone number */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-sm font-medium text-gray-900">Phone number</label>
                      <span className="text-[12px] text-gray-400">Optional</span>
                    </div>
                    <p className="text-[12px] text-gray-500 mb-2">Stripe may use this phone number to verify your recipient's identity.</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 h-10 border border-gray-200 rounded-lg text-sm text-gray-500 shrink-0">
                        <span>🇺🇸</span>
                        <span>+1</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="201 555 0123"
                        value={emailPhoneNumber}
                        onChange={(e) => setEmailPhoneNumber(e.target.value)}
                        className="flex-1 px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Available payout methods */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Available payout methods</h3>
                    <p className="text-[12px] text-gray-500 mb-3">Select which payout method options to offer to your recipient. The fees listed will be collected from your financial account.</p>
                    <div className="space-y-3">
                      {/* Bank account */}
                      <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${emailPayoutMethods.bank ? 'border-indigo-500 border-2' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="checkbox"
                          checked={emailPayoutMethods.bank}
                          onChange={(e) => setEmailPayoutMethods(prev => ({ ...prev, bank: e.target.checked }))}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Bank account</div>
                          <div className="text-[12px] text-gray-500">Arrives in 2–3 business days · US$1.50 fee</div>
                        </div>
                      </label>
                      {/* Debit card */}
                      <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${emailPayoutMethods.debit ? 'border-indigo-500 border-2' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="checkbox"
                          checked={emailPayoutMethods.debit}
                          onChange={(e) => setEmailPayoutMethods(prev => ({ ...prev, debit: e.target.checked }))}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Debit card</div>
                          <div className="text-[12px] text-gray-500">Arrives in minutes · Fee starts at US$2.00</div>
                        </div>
                      </label>
                      {/* Stablecoin */}
                      <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${emailPayoutMethods.stablecoin ? 'border-indigo-500 border-2' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="checkbox"
                          checked={emailPayoutMethods.stablecoin}
                          onChange={(e) => setEmailPayoutMethods(prev => ({ ...prev, stablecoin: e.target.checked }))}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Stablecoin transfer (USDC)</div>
                          <div className="text-[12px] text-gray-500">Arrives in seconds · US$1.50 fee</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 px-5 pb-4 pt-4 bg-white border-t border-gray-200">
                  <button
                    onClick={() => setModalStep('add-recipient')}
                    className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setModalStep('confirm')}
                    className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-indigo-500 hover:bg-indigo-600"
                  >
                    Continue
                  </button>
                </div>
              </div>

              {/* Right side - Email preview */}
              <div className="w-[440px] shrink-0 p-4">
              <div className="h-full flex flex-col items-center px-5 py-5 overflow-y-auto rounded-2xl" style={{ background: 'linear-gradient(135deg, #c4f0e8 0%, #c9d5f5 40%, #d8c4f0 70%, #e0c8ef 100%)' }}>
                {/* Tabs */}
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setEmailPreviewTab('email')}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${emailPreviewTab === 'email' ? 'border-2 border-indigo-500 text-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700 bg-white/60'}`}
                  >
                    Recipient email address
                  </button>
                  <button
                    onClick={() => setEmailPreviewTab('portal')}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${emailPreviewTab === 'portal' ? 'border-2 border-indigo-500 text-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700 bg-white/60'}`}
                  >
                    Recipient portal
                  </button>
                </div>

                {/* Email preview card */}
                {emailPreviewTab === 'email' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full h-[430px]">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                        <Icon name="send" size="small" fill="white" />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-[13px] text-gray-500">From: Stripe</div>
                        <div className="text-[13px] text-gray-500">Subject: Catherine Cactuses sandbox sent you money</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 mb-5" />
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">CC</span>
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">Catherine Cactuses sandbox</span>
                    </div>
                    <h4 className="text-[17px] font-bold text-gray-900 mb-3 leading-snug">Catherine Cactuses sandbox sent you money</h4>
                    <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
                      To receive the money, provide your information by {(() => {
                        const d = new Date()
                        d.setDate(d.getDate() + 3)
                        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      })()}.
                    </p>
                    <div className="bg-indigo-500 text-white text-[13px] font-semibold px-5 py-2 rounded-full inline-block mb-5">
                      Accept money
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Questions? Contact Catherine Cactuses sandbox at <span className="text-indigo-500">cyu+testsc@stripe.com</span> for support.
                    </p>
                  </div>
                )}

                {/* Portal preview card */}
                {emailPreviewTab === 'portal' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full h-[430px]">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">CC</span>
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">Catherine Cactuses sandbox</span>
                    </div>
                    <h4 className="text-[17px] font-bold text-gray-900 mb-3 leading-snug">You have money waiting</h4>
                    <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
                      Provide your bank details or select a payout method to receive your funds.
                    </p>
                    <div className="space-y-2.5 mb-4">
                      {emailPayoutMethods.bank && (
                        <div className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg">
                          <Icon name="bank" size="xsmall" fill="#6b7280" />
                          <span className="text-[13px] text-gray-700">Bank account</span>
                        </div>
                      )}
                      {emailPayoutMethods.debit && (
                        <div className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg">
                          <Icon name="card" size="xsmall" fill="#6b7280" />
                          <span className="text-[13px] text-gray-700">Debit card</span>
                        </div>
                      )}
                      {emailPayoutMethods.stablecoin && (
                        <div className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg">
                          <Icon name="crypto" size="xsmall" fill="#6b7280" />
                          <span className="text-[13px] text-gray-700">Stablecoin (USDC)</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Powered by <span className="font-medium">Stripe</span>
                    </p>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'business-type' && (
          <div
            className="flex h-[calc(100%-60px)]"
            onKeyDown={(e) => e.key === 'Enter' && canContinueBusinessType && setModalStep('bank-details')}
          >
            {/* Left side - Form */}
            <div className="flex-1 flex flex-col animate-[slideInRight_0.3s_ease-out]">
              {/* Scrollable form content */}
              <div className="flex-1 px-5 pt-2 overflow-y-auto">
                {/* Business type dropdown */}
                <div className="mb-5 relative">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Type of business</label>
                  <div
                    onClick={() => setShowBusinessTypeDropdown(!showBusinessTypeDropdown)}
                    className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                  >
                    <span className={`text-sm ${businessType ? 'text-gray-900' : 'text-gray-500'}`}>
                      {businessType === 'individual' ? 'Individual' : businessType === 'company' ? 'Company' : 'Select business type'}
                    </span>
                    <Icon name="chevronDown" size="small" fill="#6b7280" />
                  </div>
                  {showBusinessTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setBusinessType('individual')
                          setShowBusinessTypeDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 rounded-t-lg"
                      >
                        Individual
                      </button>
                      <button
                        onClick={() => {
                          setBusinessType('company')
                          setShowBusinessTypeDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 rounded-b-lg"
                      >
                        Company
                      </button>
                    </div>
                  )}
                </div>

                {/* Individual fields */}
                {businessType === 'individual' && (
                  <>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Legal first name</label>
                      <input
                        type="text"
                        placeholder="Legal first name"
                        value={legalFirstName}
                        onChange={(e) => setLegalFirstName(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Legal last name</label>
                      <input
                        type="text"
                        placeholder="Legal last name"
                        value={legalLastName}
                        onChange={(e) => setLegalLastName(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>
                  </>
                )}

                {/* Company fields */}
                {businessType === 'company' && (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Company name</label>
                    <input
                      type="text"
                      placeholder="Company name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                    />
                    <p className="text-[12px] text-gray-500 mt-1.5">Must match the name associated with the bank account that you'll provide next.</p>
                  </div>
                )}
              </div>

              {/* Buttons - fixed at bottom */}
              <div className="flex justify-end gap-3 px-5 pb-4">
                <button
                  onClick={() => setModalStep('add-recipient')}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  disabled={!canContinueBusinessType}
                  onClick={() => canContinueBusinessType && setModalStep('bank-details')}
                  className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    canContinueBusinessType
                      ? 'bg-indigo-500 hover:bg-indigo-600'
                      : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-1/2 my-4 mr-4 p-4 rounded-2xl flex items-center justify-center" style={{ backgroundImage: 'url(/right-gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="bg-white rounded-xl p-4 shadow-md border-[12px] border-gray-100 w-[400px]">
                <div key={modalStep} className="animate-[fadeIn_0.3s_ease-out]">
                  {/* Review section */}
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Review</h3>
                  <div className="space-y-2 text-[14px]">
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">From</span>
                      <div className="w-32 h-4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">To</span>
                      <div className="w-32 h-4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Method</span>
                      <span className="text-gray-900">
                        {selectedMethod === 'email' ? 'Pay via email' : selectedMethod === 'ach' ? 'Standard transfer' : selectedMethod === 'wire' ? 'Wire transfer' : selectedMethod === 'stablecoin' ? 'Stablecoin transfer (USDC)' : ''}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Initiated</span>
                      <span className="text-gray-900">September 30, 2025</span>
                    </div>
                    {selectedMethod !== 'email' && (
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Estimated arrival</span>
                      <span className="text-gray-900">
                        {selectedMethod === 'ach' ? '2-3 business days' : selectedMethod === 'wire' ? 'Minutes' : selectedMethod === 'stablecoin' ? 'Seconds' : ''}
                      </span>
                    </div>
                    )}
                  </div>

                  {/* Fees section */}
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Fees</h3>
                    <div className="space-y-2 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payout amount</span>
                        {getPayoutAmountNum() > 0 ? <span className="text-gray-900">${formatCurrency(getPayoutAmountNum())}</span> : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Standard payout fee</span>
                        <span className="text-gray-900">${formatCurrency(getFee())}</span>
                      </div>
                      {recipientCountry !== 'US' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Foreign exchange fee</span>
                          {getPayoutAmountNum() > 0 ? <span className="text-gray-900">${formatCurrency(getFxFee())}</span> : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">You'll pay</span>
                        {getPayoutAmountNum() > 0 ? <span className="text-gray-900 font-medium">${formatCurrency(getTotalPay())}</span> : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">They'll receive</span>
                        {getPayoutAmountNum() > 0 ? (
                          <span className="text-gray-900 font-medium">
                            {recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `$${formatCurrency(getPayoutAmountNum())}`}
                          </span>
                        ) : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'bank-details' && (
          <div
            className="flex h-[calc(100%-60px)]"
            onKeyDown={(e) => e.key === 'Enter' && canContinueBankDetails && setModalStep('confirm')}
          >
            {/* Left side - Form */}
            <div className="flex-1 flex flex-col animate-[slideInRight_0.3s_ease-out]">
              {/* Scrollable form content */}
              <div className="flex-1 px-5 pt-2 overflow-y-auto">
                <p className="text-[12px] text-gray-500 mb-4">Provide a payout method that belongs to {businessType === 'company' ? (businessName || 'Company') : `${legalFirstName} ${legalLastName}`} in {selectedCountry.name}.</p>
                {selectedMethod === 'stablecoin' ? (
                  <>
                    {/* Currency */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Currency</label>
                      <div className="w-full px-4 h-10 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 flex items-center">
                        USDC
                      </div>
                    </div>

                    {/* Network */}
                    <div className="mb-5 relative">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Network</label>
                      <div
                        onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <NetworkIcon id={selectedNetwork} size={24} />
                          <span className="font-medium">{networks.find(n => n.id === selectedNetwork)?.name}</span>
                        </div>
                        <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-gray-400" />
                      </div>
                      {showNetworkDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 max-h-[280px] overflow-y-auto">
                          {networks.map((network) => (
                            <button
                              key={network.id}
                              onClick={() => { setSelectedNetwork(network.id); setShowNetworkDropdown(false) }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-left"
                            >
                              <NetworkIcon id={network.id} size={28} />
                              <span className="text-sm font-medium text-gray-900 flex-1">{network.name}</span>
                              {selectedNetwork === network.id && (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                  <circle cx="9" cy="9" r="9" fill="#6366f1" />
                                  <path d="M5.5 9L8 11.5L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Wallet address */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Stablecoin wallet address</label>
                      <input
                        type="text"
                        placeholder="0xABC123...DEF789"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Routing number */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Routing number</label>
                      <input
                        type="text"
                        placeholder="110000000"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>

                    {/* Account number */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Account number</label>
                      <input
                        type="text"
                        placeholder="000123456789"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>

                    {/* Confirm account number */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Confirm account number</label>
                      <input
                        type="text"
                        placeholder="000123456789"
                        value={confirmAccountNumber}
                        onChange={(e) => setConfirmAccountNumber(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Buttons - fixed at bottom */}
              <div className="flex justify-end gap-3 px-5 pb-4">
                <button
                  onClick={() => setModalStep('business-type')}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  disabled={!canContinueBankDetails}
                  onClick={() => canContinueBankDetails && setModalStep('confirm')}
                  className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    canContinueBankDetails
                      ? 'bg-indigo-500 hover:bg-indigo-600'
                      : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-1/2 my-4 mr-4 p-4 rounded-2xl flex items-center justify-center" style={{ backgroundImage: 'url(/right-gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="bg-white rounded-xl p-4 shadow-md border-[12px] border-gray-100 w-[400px]">
                <div key={modalStep} className="animate-[fadeIn_0.3s_ease-out]">
                  {/* Review section */}
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Review</h3>
                  <div className="space-y-2 text-[14px]">
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">From</span>
                      <div className="w-32 h-4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">To</span>
                      <div className="w-32 h-4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Method</span>
                      <span className="text-gray-900">
                        {selectedMethod === 'email' ? 'Pay via email' : selectedMethod === 'ach' ? 'Standard transfer' : selectedMethod === 'wire' ? 'Wire transfer' : selectedMethod === 'stablecoin' ? 'Stablecoin transfer (USDC)' : ''}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Initiated</span>
                      <span className="text-gray-900">September 30, 2025</span>
                    </div>
                    {selectedMethod !== 'email' && (
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Estimated arrival</span>
                      <span className="text-gray-900">
                        {selectedMethod === 'ach' ? '2-3 business days' : selectedMethod === 'wire' ? 'Minutes' : selectedMethod === 'stablecoin' ? 'Seconds' : ''}
                      </span>
                    </div>
                    )}
                  </div>

                  {/* Fees section */}
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Fees</h3>
                    <div className="space-y-2 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payout amount</span>
                        {getPayoutAmountNum() > 0 ? <span className="text-gray-900">${formatCurrency(getPayoutAmountNum())}</span> : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Standard payout fee</span>
                        <span className="text-gray-900">${formatCurrency(getFee())}</span>
                      </div>
                      {recipientCountry !== 'US' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Foreign exchange fee</span>
                          {getPayoutAmountNum() > 0 ? <span className="text-gray-900">${formatCurrency(getFxFee())}</span> : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">You'll pay</span>
                        {getPayoutAmountNum() > 0 ? <span className="text-gray-900 font-medium">${formatCurrency(getTotalPay())}</span> : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">They'll receive</span>
                        {getPayoutAmountNum() > 0 ? (
                          <span className="text-gray-900 font-medium">
                            {recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `$${formatCurrency(getPayoutAmountNum())}`}
                          </span>
                        ) : <div className="w-24 h-4 bg-gray-100 rounded"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'confirm' && (
          <div
            className="flex h-[calc(100%-60px)]"
            onKeyDown={(e) => e.key === 'Enter' && canContinueConfirm && setModalStep(repeatPayout ? 'repeat-config' : 'summary')}
          >
            {/* Left side - Payment details */}
            <div className="flex-1 flex flex-col animate-[slideInRight_0.3s_ease-out]">
              {/* Scrollable form content */}
              <div ref={confirmScrollRef} className="flex-1 px-5 pt-2 overflow-y-auto">
                {/* Amount input */}
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-display-small text-default mr-0.5">$</span>
                  <div className="border-b-2 border-default">
                    <input
                      type="text"
                      value={payoutAmount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '')
                        setPayoutAmount(val)
                        setEditingField('send')
                        const num = parseFloat(val) || 0
                        if (recipientCountry !== 'US' && selectedCountry) {
                          setReceiveAmount(num ? (num * selectedCountry.exchangeRate).toFixed(2) : '')
                        }
                      }}
                      placeholder="0"
                      className="text-display-xlarge-subdued text-default w-32 outline-none text-center placeholder-placeholder bg-transparent font-[500]"
                    />
                  </div>
                  <span className="text-body-large text-subdued ml-2">USD</span>
                </div>

                {/* From section */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Send from</label>
                  <div
                    ref={fromDropdownRef}
                    onClick={() => {
                      if (!showFromDropdown && fromDropdownRef.current) {
                        const rect = fromDropdownRef.current.getBoundingClientRect()
                        setFromDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
                      }
                      setShowFromDropdown(!showFromDropdown)
                    }}
                    className="flex items-center justify-between px-3 h-14 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-base">
                        {fromAccount.flag}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{fromAccount.name}</div>
                        <div className="text-[12px] text-gray-500">{fromAccount.currency}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-900">
                      <span>{fromAccount.symbol}{formatCurrency(fromAccount.balance)}</span>
                      <Icon name="chevronUpDown" size="small" fill="#6b7280" />
                    </div>
                  </div>
                </div>

                {/* To section */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">To</label>
                  <div className="flex items-center gap-3 px-3 h-14 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon name="customers" size="small" fill="#6b7280" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {isExistingRecipient ? selectedRecipientName : businessType === 'individual' ? `${legalFirstName} ${legalLastName}` : (businessName || 'Company')}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {selectedMethod === 'stablecoin'
                          ? `USDC · ${networks.find(n => n.id === selectedNetwork)?.name || 'Base'} ${walletAddress ? `····${walletAddress.slice(-4)}` : ''}`
                          : `USD · Wells Fargo ····${accountNumber.slice(-4) || '1234'}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method section */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Method</label>
                  <div className="flex items-center gap-3 px-3 h-14 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon name="bank" size="small" fill="#6b7280" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedMethod === 'email' ? 'Pay via email' : selectedMethod === 'ach' ? 'Standard transfer' : selectedMethod === 'wire' ? 'Wire transfer' : 'Stablecoin transfer (USDC)'}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {selectedMethod === 'email' ? 'Payout method to be collected' : selectedMethod === 'ach' ? 'Arrives in 2–3 business days · US$1.50 fee' : selectedMethod === 'wire' ? 'Arrives in 1 business day · US$25.00 fee' : 'Arrives in seconds · Up to US$1.50 fee'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* When section - hidden */}

                {/* They receive field - only for cross-border */}
                {recipientCountry !== 'US' && (
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-500">They receive</label>
                    <div className="flex items-center gap-2 px-4 h-10 border border-gray-200 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <span className="text-gray-400">{selectedCountry.currencySymbol}</span>
                      <input
                        type="text"
                        value={editingField === 'receive' ? receiveAmount : (payoutAmount ? (parseFloat(payoutAmount) * selectedCountry.exchangeRate).toFixed(2) : '')}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '')
                          setReceiveAmount(val)
                          setEditingField('receive')
                          const num = parseFloat(val) || 0
                          if (selectedCountry && selectedCountry.exchangeRate) {
                            setPayoutAmount(num ? (num / selectedCountry.exchangeRate).toFixed(2) : '')
                          }
                        }}
                        onFocus={() => {
                          if (editingField !== 'receive') {
                            setReceiveAmount(payoutAmount ? (parseFloat(payoutAmount) * selectedCountry.exchangeRate).toFixed(2) : '')
                            setEditingField('receive')
                          }
                        }}
                        onBlur={() => setEditingField('send')}
                        placeholder="0.00"
                        className="w-24 text-right text-gray-700 outline-none bg-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* View fees expandable section - always shown */}
                <div className="bg-gray-50 rounded-lg">
                  <button
                    onClick={() => setShowFXDetails(!showFXDetails)}
                    className="w-full flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name={showFXDetails ? 'chevronDown' : 'chevronRight'} size="small" fill="#6b7280" />
                      <span className="text-sm text-gray-600">{recipientCountry !== 'US' ? 'View fees and FX rate' : 'View fees'}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">${formatCurrency(getFee() + getFxFee())}</span>
                  </button>

                  {showFXDetails && (
                    <div className="px-3 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Standard payout fee</span>
                        <span className="text-sm text-gray-700">${formatCurrency(getFee())}</span>
                      </div>
                      {recipientCountry !== 'US' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Foreign exchange fee</span>
                            <span className="text-sm text-gray-700">${formatCurrency(getFxFee())}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">We'll convert</span>
                            <span className="text-sm text-gray-700">${payoutAmount ? formatCurrency(parseFloat(payoutAmount) - getFxFee()) : '0.00'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-500">Exchange rate</span>
                              <Icon name="info" size="small" fill="#9ca3af" />
                            </div>
                            <span className="text-sm text-gray-700">$1 USD = {selectedCountry.currencySymbol}{selectedCountry.exchangeRate} {selectedCountry.currency}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Buttons - fixed at bottom */}
              <div className={`flex justify-end gap-3 px-5 pb-4 bg-white ${isContentOverflowing ? 'pt-4 border-t border-gray-200' : ''}`}>
                <button
                  onClick={() => setModalStep(isExistingRecipient ? 'choose-recipient' : selectedMethod === 'email' ? 'email-config' : 'bank-details')}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  disabled={!canContinueConfirm}
                  onClick={() => canContinueConfirm && setModalStep(repeatPayout ? 'repeat-config' : 'summary')}
                  className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    canContinueConfirm
                      ? 'bg-indigo-500 hover:bg-indigo-600'
                      : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-1/2 my-4 mr-4 p-4 rounded-2xl flex items-center justify-center" style={{ backgroundImage: 'url(/right-gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="bg-white rounded-xl p-4 shadow-md border-[12px] border-gray-100 w-[400px]">
                <div key={modalStep} className="animate-[fadeIn_0.3s_ease-out]">
                  {/* Review section */}
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Review</h3>
                  <div className="space-y-2 text-[14px]">
                    <div className="flex gap-6 items-start">
                      <span className="text-gray-500 w-28">From</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">S</span>
                        </div>
                        <div>
                          <div className="text-gray-900">Financial account</div>
                          <div className="text-gray-500">USD</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <span className="text-gray-500 w-28">To</span>
                      {selectedMethod === 'stablecoin' ? (
                        <div className="flex items-center gap-2 flex-1">
                          <NetworkIcon id={selectedNetwork} size={24} />
                          <div>
                            <div className="text-gray-900">{networks.find(n => n.id === selectedNetwork)?.name || 'Base'} wallet</div>
                            <div className="text-gray-500 text-[12px]">{walletAddress ? `${walletAddress.slice(0, 6)}····${walletAddress.slice(-4)}` : 'No address'}</div>
                          </div>
                        </div>
                      ) : selectedMethod === 'email' ? (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <Icon name="person" size="xxsmall" fill="#6b7280" />
                          </div>
                          <div className="text-gray-900">{recipientEmail || 'mkerr@company.com'}</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-red-700 rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">WF</span>
                          </div>
                          <div>
                            <div className="text-gray-900">Wells Fargo ····{accountNumber.slice(-4) || '1234'}</div>
                            <div className="text-gray-500">{selectedCountry.currency}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Method</span>
                      <span className="text-gray-900 flex-1">
                        {selectedMethod === 'email' ? 'Pay via email' : selectedMethod === 'ach' ? 'Standard transfer' : selectedMethod === 'wire' ? 'Wire transfer' : selectedMethod === 'stablecoin' ? 'Stablecoin transfer (USDC)' : ''}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">{selectedDate.toDateString() === new Date().toDateString() ? 'Initiated on' : 'Initiated on'}</span>
                      <span className="text-gray-900 flex-1">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {selectedMethod !== 'email' && (
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Estimated arrival</span>
                      <span className="text-gray-900 flex-1">
                        {selectedMethod === 'ach' ? '2-3 business days' : selectedMethod === 'wire' ? 'Minutes' : selectedMethod === 'stablecoin' ? 'Seconds' : ''}
                      </span>
                    </div>
                    )}
                  </div>

                  {/* Fees section */}
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Fees</h3>
                    <div className="space-y-2 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payout amount</span>
                        <span className="text-gray-900">${formatCurrency(getPayoutAmountNum())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Standard payout fee</span>
                        <span className="text-gray-900">${formatCurrency(getFee())}</span>
                      </div>
                      {recipientCountry !== 'US' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Foreign exchange fee</span>
                          <span className="text-gray-900">${formatCurrency(getFxFee())}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">You'll pay</span>
                        <span className="text-gray-900 font-medium">${formatCurrency(getTotalPay())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">They'll receive</span>
                        <span className="text-gray-900 font-medium">
                          {recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `$${formatCurrency(getPayoutAmountNum())}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'repeat-config' && (
          <div
            className="flex h-[calc(100%-60px)]"
            onKeyDown={(e) => e.key === 'Enter' && setModalStep('summary')}
          >
            {/* Left side - Repeat config */}
            <div className="flex-1 flex flex-col animate-[slideInRight_0.3s_ease-out]">
              {/* Scrollable form content */}
              <div className="flex-1 px-5 pt-2 overflow-y-auto">
                {/* Date range picker - First and Last instance combined */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Duration</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    {/* Left side - First instance */}
                    <div
                      onClick={() => showFirstInstanceCalendar ? closeFirstInstanceCalendar() : setShowFirstInstanceCalendar(true)}
                      className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 flex-1"
                    >
                      <Icon name="calendar" size="small" fill="#6b7280" />
                      <span className="text-gray-900">
                        {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {/* Arrow */}
                    <span className="text-gray-400 px-2">{'\u2192'}</span>
                    {/* Right side - Last instance */}
                    <div
                      onClick={() => showLastInstanceCalendar ? closeLastInstanceCalendar() : setShowLastInstanceCalendar(true)}
                      className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 flex-1 justify-end"
                    >
                      <span className={`${lastInstanceDate ? 'text-gray-900' : 'text-gray-500'}`}>
                        {lastInstanceDate ? lastInstanceDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Forever'}
                      </span>
                    </div>
                  </div>

                  {/* First instance calendar popup */}
                  {showFirstInstanceCalendar && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={closeFirstInstanceCalendar} />
                      <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[70] p-4 w-[300px] ${isFirstInstanceCalendarClosing ? 'animate-[fadeOut_0.15s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}>
                        {/* Calendar header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">{monthNames[firstInstanceCalendarMonth]} {firstInstanceCalendarYear}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={prevFirstInstanceMonth}
                              disabled={firstInstanceCalendarMonth === new Date().getMonth() && firstInstanceCalendarYear === new Date().getFullYear()}
                              className={`p-1 rounded ${firstInstanceCalendarMonth === new Date().getMonth() && firstInstanceCalendarYear === new Date().getFullYear() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                              <Icon name="chevronLeft" size="small" fill="#6b7280" />
                            </button>
                            <button onClick={nextFirstInstanceMonth} className="p-1 hover:bg-gray-100 rounded">
                              <Icon name="chevronRight" size="small" fill="#6b7280" />
                            </button>
                          </div>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day) => (
                            <div key={day} className="text-center text-sm text-gray-500 py-1">{day}</div>
                          ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1 h-[228px]">
                          {/* Empty cells for days before the first of the month */}
                          {Array.from({ length: getFirstDayOfMonth(firstInstanceCalendarMonth, firstInstanceCalendarYear) }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2"></div>
                          ))}
                          {/* Days of the month */}
                          {Array.from({ length: getDaysInMonth(firstInstanceCalendarMonth, firstInstanceCalendarYear) }).map((_, i) => {
                            const day = i + 1
                            const past = isFirstInstancePastDay(day)
                            return (
                              <button
                                key={day}
                                onClick={() => !past && handleFirstInstanceDateSelect(day)}
                                disabled={past}
                                className={`p-2 text-sm rounded-lg ${
                                  past
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : isFirstInstanceSelected(day)
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    : isFirstInstanceToday(day)
                                    ? 'text-indigo-600 font-bold hover:bg-gray-100'
                                    : 'text-gray-900 hover:bg-gray-100'
                                }`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Last instance calendar popup */}
                  {showLastInstanceCalendar && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={closeLastInstanceCalendar} />
                      <div className={`absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-[70] p-4 w-[300px] ${isLastInstanceCalendarClosing ? 'animate-[fadeOut_0.15s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}>
                        {/* Calendar header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">{monthNames[lastInstanceCalendarMonth]} {lastInstanceCalendarYear}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={prevLastInstanceMonth}
                              disabled={isLastInstanceCurrentMonth()}
                              className={`p-1 rounded ${isLastInstanceCurrentMonth() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                              <Icon name="chevronLeft" size="small" fill="#6b7280" />
                            </button>
                            <button onClick={nextLastInstanceMonth} className="p-1 hover:bg-gray-100 rounded">
                              <Icon name="chevronRight" size="small" fill="#6b7280" />
                            </button>
                          </div>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day) => (
                            <div key={day} className="text-center text-sm text-gray-500 py-1">{day}</div>
                          ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1 h-[228px]">
                          {/* Empty cells for days before the first of the month */}
                          {Array.from({ length: getFirstDayOfMonth(lastInstanceCalendarMonth, lastInstanceCalendarYear) }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2"></div>
                          ))}
                          {/* Days of the month */}
                          {Array.from({ length: getDaysInMonth(lastInstanceCalendarMonth, lastInstanceCalendarYear) }).map((_, i) => {
                            const day = i + 1
                            const disabled = isLastInstanceDisabledDay(day)
                            return (
                              <button
                                key={day}
                                onClick={() => !disabled && handleLastInstanceDateSelect(day)}
                                disabled={disabled}
                                className={`p-2 text-sm rounded-lg ${
                                  disabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : isLastInstanceSelected(day)
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    : 'text-gray-900 hover:bg-gray-100'
                                }`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

              {/* Cadence */}
              <div className="mb-3 relative">
                <label className="block text-sm font-medium text-gray-900 mb-1">Cadence</label>
                <div
                  onClick={() => setShowCadenceDropdown(!showCadenceDropdown)}
                  className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                >
                  <span className={`${selectedCadence ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedCadence || 'Select cadence'}
                  </span>
                  <Icon name="chevronUpDown" size="small" fill="#6b7280" />
                </div>
                {showCadenceDropdown && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setShowCadenceDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70]">
                      {['Weekly', 'Monthly', 'Annually', 'Custom'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            const wasCustom = customCadence || selectedCadence === 'Custom'
                            setShowCadenceDropdown(false)
                            if (option === 'Custom') {
                              setSelectedCadence(option)
                              setCustomCadence(true)
                            } else if (wasCustom) {
                              setIsCustomCadenceClosing(true)
                              setTimeout(() => {
                                setSelectedCadence(option)
                                setCustomCadence(false)
                                setIsCustomCadenceClosing(false)
                              }, 200)
                            } else {
                              setSelectedCadence(option)
                              setCustomCadence(false)
                            }
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            selectedCadence === option ? 'text-indigo-600 bg-indigo-50' : 'text-gray-900'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Create custom cadence checkbox */}
              <div
                className="flex items-center gap-3 mb-4 cursor-pointer"
                onClick={() => {
                  const isCurrentlyCustom = customCadence || selectedCadence === 'Custom'
                  if (isCurrentlyCustom) {
                    setIsCustomCadenceClosing(true)
                    setTimeout(() => {
                      setCustomCadence(false)
                      setSelectedCadence(null)
                      setIsCustomCadenceClosing(false)
                    }, 200)
                  } else {
                    setCustomCadence(true)
                    setSelectedCadence('Custom')
                  }
                }}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${customCadence || selectedCadence === 'Custom' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                  {(customCadence || selectedCadence === 'Custom') && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-900">Create custom cadence</span>
              </div>

              {/* Custom cadence options */}
              {(customCadence || selectedCadence === 'Custom' || isCustomCadenceClosing) && (
                <div className={isCustomCadenceClosing ? 'animate-[fadeOut_0.2s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}>
                  {/* Repeat every */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Repeat every</label>
                    <div className="flex gap-3">
                      {/* Number dropdown */}
                      <div className="relative flex-1">
                        <div
                          onClick={() => setShowRepeatNumberDropdown(!showRepeatNumberDropdown)}
                          className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                        >
                          <span className="text-gray-900">{repeatEveryNumber}</span>
                          <Icon name="chevronUpDown" size="small" fill="#6b7280" />
                        </div>
                        {showRepeatNumberDropdown && (
                          <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setShowRepeatNumberDropdown(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] max-h-48 overflow-y-auto">
                              {Array.from({ length: repeatEveryPeriod === 'Days' ? 31 : repeatEveryPeriod === 'Weeks' ? 7 : repeatEveryPeriod === 'Months' ? 12 : 10 }, (_, i) => String(i + 1)).map((num) => (
                                <button
                                  key={num}
                                  onClick={() => {
                                    setRepeatEveryNumber(num)
                                    setShowRepeatNumberDropdown(false)
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                    repeatEveryNumber === num ? 'text-indigo-600 bg-indigo-50' : 'text-gray-900'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {/* Period dropdown */}
                      <div className="relative flex-1">
                        <div
                          onClick={() => setShowRepeatPeriodDropdown(!showRepeatPeriodDropdown)}
                          className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
                        >
                          <span className="text-gray-900">{repeatEveryPeriod}</span>
                          <Icon name="chevronUpDown" size="small" fill="#6b7280" />
                        </div>
                        {showRepeatPeriodDropdown && (
                          <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setShowRepeatPeriodDropdown(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70]">
                              {['Days', 'Weeks', 'Months', 'Instances'].map((period) => (
                                <button
                                  key={period}
                                  onClick={() => {
                                    const maxNum = period === 'Days' ? 31 : period === 'Weeks' ? 7 : period === 'Months' ? 12 : 10
                                    if (parseInt(repeatEveryNumber) > maxNum) {
                                      setRepeatEveryNumber('1')
                                    }
                                    setRepeatEveryPeriod(period)
                                    setShowRepeatPeriodDropdown(false)
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                    repeatEveryPeriod === period ? 'text-indigo-600 bg-indigo-50' : 'text-gray-900'
                                  }`}
                                >
                                  {period}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Repeats on (days of week) */}
                  {repeatEveryPeriod === 'Weeks' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Repeats on</label>
                      <div className="flex gap-2">
                        {[
                          { key: 'sun', label: 'S' },
                          { key: 'mon', label: 'M' },
                          { key: 'tue', label: 'T' },
                          { key: 'wed', label: 'W' },
                          { key: 'thu', label: 'T' },
                          { key: 'fri', label: 'F' },
                          { key: 'sat', label: 'S' }
                        ].map((day) => (
                          <button
                            key={day.key}
                            onClick={() => {
                              if (selectedDaysOfWeek.includes(day.key)) {
                                setSelectedDaysOfWeek(selectedDaysOfWeek.filter(d => d !== day.key))
                              } else {
                                setSelectedDaysOfWeek([...selectedDaysOfWeek, day.key])
                              }
                            }}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium ${
                              selectedDaysOfWeek.includes(day.key)
                                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Buttons - fixed at bottom */}
              <div className="flex justify-end gap-3 px-5 pb-4">
                <button
                  onClick={() => setModalStep('confirm')}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setModalStep('summary')}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-indigo-500 hover:bg-indigo-600"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-1/2 my-4 mr-4 p-4 rounded-2xl flex items-center justify-center" style={{ backgroundImage: 'url(/right-gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="bg-white rounded-xl p-4 shadow-md border-[12px] border-gray-100 w-[400px]">
                <div key={modalStep} className="animate-[fadeIn_0.3s_ease-out]">
                  {/* Review section */}
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Review</h3>
                  <div className="space-y-2 text-[14px]">
                    <div className="flex gap-6 items-start">
                      <span className="text-gray-500 w-28">From</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">S</span>
                        </div>
                        <div>
                          <div className="text-gray-900">Financial account</div>
                          <div className="text-gray-500">USD</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <span className="text-gray-500 w-28">To</span>
                      {selectedMethod === 'stablecoin' ? (
                        <div className="flex items-center gap-2 flex-1">
                          <NetworkIcon id={selectedNetwork} size={24} />
                          <div>
                            <div className="text-gray-900">{networks.find(n => n.id === selectedNetwork)?.name || 'Base'} wallet</div>
                            <div className="text-gray-500 text-[12px]">{walletAddress ? `${walletAddress.slice(0, 6)}····${walletAddress.slice(-4)}` : 'No address'}</div>
                          </div>
                        </div>
                      ) : selectedMethod === 'email' ? (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <Icon name="person" size="xxsmall" fill="#6b7280" />
                          </div>
                          <div className="text-gray-900">{recipientEmail || 'mkerr@company.com'}</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-red-700 rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">WF</span>
                          </div>
                          <div>
                            <div className="text-gray-900">Wells Fargo ····{accountNumber.slice(-4) || '1234'}</div>
                            <div className="text-gray-500">USD</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Method</span>
                      <span className="text-gray-900 flex-1">
                        {selectedMethod === 'email' ? 'Pay via email' : selectedMethod === 'ach' ? 'Standard transfer' : selectedMethod === 'wire' ? 'Wire transfer' : selectedMethod === 'stablecoin' ? 'Stablecoin transfer (USDC)' : ''}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">{selectedDate.toDateString() === new Date().toDateString() ? 'Initiated on' : 'Initiated on'}</span>
                      <span key={`initiates-${selectedDate.getTime()}`} className="text-gray-900 flex-1 animate-[fadeIn_0.2s_ease-out]">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {selectedCadence === 'Monthly' && (
                      <div className="flex gap-6 animate-[fadeIn_0.2s_ease-out]">
                        <span className="text-gray-500 w-28">Repeats on</span>
                        <span key={`monthly-${selectedDate.getDate()}`} className="text-gray-900 flex-1 animate-[fadeIn_0.2s_ease-out]">
                          {selectedDate.getDate()}{selectedDate.getDate() === 1 || selectedDate.getDate() === 21 || selectedDate.getDate() === 31 ? 'st' : selectedDate.getDate() === 2 || selectedDate.getDate() === 22 ? 'nd' : selectedDate.getDate() === 3 || selectedDate.getDate() === 23 ? 'rd' : 'th'} of every month
                        </span>
                      </div>
                    )}
                    {selectedCadence === 'Weekly' && (
                      <div className="flex gap-6 animate-[fadeIn_0.2s_ease-out]">
                        <span className="text-gray-500 w-28">Repeats on</span>
                        <span key={`weekly-${selectedDate.getDay()}`} className="text-gray-900 flex-1 animate-[fadeIn_0.2s_ease-out]">
                          Every {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                      </div>
                    )}
                    {selectedCadence === 'Annually' && (
                      <div className="flex gap-6 animate-[fadeIn_0.2s_ease-out]">
                        <span className="text-gray-500 w-28">Repeats on</span>
                        <span key={`annually-${selectedDate.getMonth()}-${selectedDate.getDate()}`} className="text-gray-900 flex-1 animate-[fadeIn_0.2s_ease-out]">
                          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, every year
                        </span>
                      </div>
                    )}
                    {(selectedCadence === 'Monthly' || selectedCadence === 'Weekly' || selectedCadence === 'Annually') && lastInstanceDate && (
                      <div className="flex gap-6 animate-[fadeIn_0.2s_ease-out]">
                        <span className="text-gray-500 w-28">Ends on</span>
                        <span key={`ends-${lastInstanceDate.getTime()}`} className="text-gray-900 flex-1 animate-[fadeIn_0.2s_ease-out]">{lastInstanceDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {selectedMethod !== 'email' && (
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Estimated arrival</span>
                      <span className="text-gray-900 flex-1">
                        {selectedMethod === 'ach' ? '2-3 business days' : selectedMethod === 'wire' ? 'Minutes' : selectedMethod === 'stablecoin' ? 'Seconds' : ''}
                      </span>
                    </div>
                    )}
                  </div>

                  {/* Fees section */}
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Fees</h3>
                    <div className="space-y-2 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payout amount</span>
                        <span className="text-gray-900">${formatCurrency(getPayoutAmountNum())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Standard payout fee</span>
                        <span className="text-gray-900">${formatCurrency(getFee())}</span>
                      </div>
                      {recipientCountry !== 'US' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Foreign exchange fee</span>
                          <span className="text-gray-900">${formatCurrency(getFxFee())}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">You'll pay</span>
                        <span className="text-gray-900 font-medium">${formatCurrency(getTotalPay())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">They'll receive</span>
                        <span className="text-gray-900 font-medium">
                          {recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `$${formatCurrency(getPayoutAmountNum())}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'summary' && (
          <div
            className="flex h-[calc(100%-60px)]"
            onKeyDown={(e) => { if (e.key === 'Enter') { createScheduledPayout(); setModalStep('success'); } }}
          >
            {/* Left side - Summary */}
            <div className="flex-1 flex flex-col animate-[slideInRight_0.3s_ease-out]">
              {/* Scrollable form content */}
              <div className="flex-1 px-5 pt-2 overflow-y-auto">
                {/* Amount display */}
                <div className="mb-1">
                  <span className="text-display-xlarge text-gray-900">${formatCurrency(getPayoutAmountNum())}</span>
                </div>
                <div className="text-body-medium text-gray-500 mb-6">
                  to {businessType === 'individual' ? `${legalFirstName} ${legalLastName}` : (businessName || 'Company')}
                </div>

                {/* Statement descriptor section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">Statement descriptor</span>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">Optional</span>
                    </div>
                    <div className="relative group">
                      <Icon name="info" size="small" fill="#9ca3af" className="cursor-help" />
                      <div className="fixed w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 -translate-x-[calc(100%-20px)] -translate-y-[calc(100%+8px)]">
                        <p className="text-sm text-gray-700">This is the text your recipient will see on their bank statement. You can also configure an account-level statement descriptor for all your payouts in <a href="#" className="text-indigo-600 hover:text-indigo-700">Settings</a></p>
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Statement descriptor"
                    value={statementDescriptor}
                    onChange={(e) => setStatementDescriptor(e.target.value)}
                    className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                  />
                </div>

                {/* Internal note section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">Internal note</span>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">Optional</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="w-full px-4 h-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                  />
                </div>

                {/* Notify recipient checkbox */}
                <div
                  className="flex items-start gap-3 mb-4 cursor-pointer"
                  onClick={() => setNotifyRecipient(!notifyRecipient)}
                >
                  <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${notifyRecipient ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                    {notifyRecipient && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Notify recipient</div>
                    <div className="text-sm text-gray-500">Send a payment confirmation to {recipientEmail || 'mkerr@company.com'}</div>
                  </div>
                </div>

                {/* Payroll payment checkbox - only shown when NACHA toggle is on */}
                {withNACHA && (
                  <div
                    className="flex items-start gap-3 mb-6 cursor-pointer"
                    onClick={() => setIsPayrollPayment(!isPayrollPayment)}
                  >
                    <div className={`mt-1 w-4 h-4 min-w-4 min-h-4 rounded border flex items-center justify-center flex-shrink-0 ${isPayrollPayment ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                      {isPayrollPayment && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Payroll payment</div>
                      <div className="text-sm text-gray-500">Select if this payment is for compensation to employees or contractors. Required for financial regulation compliance.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons - fixed at bottom */}
              <div className="flex justify-end gap-3 px-5 pb-4">
                <button
                  onClick={() => setModalStep('confirm')}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    createScheduledPayout()
                    setModalStep('success')
                  }}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-indigo-500 hover:bg-indigo-600"
                >
                  {repeatPayout ? 'Create payout' : `Send $${formatCurrency(getPayoutAmountNum())}`}
                </button>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-1/2 my-4 mr-4 p-4 rounded-2xl flex items-center justify-center" style={{ backgroundImage: 'url(/summary-gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="bg-white rounded-xl p-4 shadow-md border-[12px] border-gray-100 w-[400px]">
                <div key={modalStep} className="animate-[fadeIn_0.3s_ease-out]">
                  {/* Review section */}
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Review</h3>
                  <div className="space-y-2 text-[14px]">
                    <div className="flex gap-6 items-start">
                      <span className="text-gray-500 w-28">From</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">S</span>
                        </div>
                        <div>
                          <div className="text-gray-900">Financial account</div>
                          <div className="text-gray-500">USD</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <span className="text-gray-500 w-28">To</span>
                      {selectedMethod === 'stablecoin' ? (
                        <div className="flex items-center gap-2 flex-1">
                          <NetworkIcon id={selectedNetwork} size={24} />
                          <div>
                            <div className="text-gray-900">{networks.find(n => n.id === selectedNetwork)?.name || 'Base'} wallet</div>
                            <div className="text-gray-500 text-[12px]">{walletAddress ? `${walletAddress.slice(0, 6)}····${walletAddress.slice(-4)}` : 'No address'}</div>
                          </div>
                        </div>
                      ) : selectedMethod === 'email' ? (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <Icon name="person" size="xxsmall" fill="#6b7280" />
                          </div>
                          <div className="text-gray-900">{recipientEmail || 'mkerr@company.com'}</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-red-700 rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">WF</span>
                          </div>
                          <div>
                            <div className="text-gray-900">Wells Fargo ····{accountNumber.slice(-4) || '1234'}</div>
                            <div className="text-gray-500">USD</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Method</span>
                      <span className="text-gray-900 flex-1">
                        {selectedMethod === 'email' ? 'Pay via email' : selectedMethod === 'ach' ? 'Standard transfer' : selectedMethod === 'wire' ? 'Wire transfer' : selectedMethod === 'stablecoin' ? 'Stablecoin transfer (USDC)' : ''}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">{selectedDate.toDateString() === new Date().toDateString() ? 'Initiated on' : 'Initiated on'}</span>
                      <span className="text-gray-900 flex-1">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {repeatPayout && selectedCadence === 'Monthly' && (
                      <div className="flex gap-6">
                        <span className="text-gray-500 w-28">Repeats on</span>
                        <span className="text-gray-900 flex-1">
                          {selectedDate.getDate()}{selectedDate.getDate() === 1 || selectedDate.getDate() === 21 || selectedDate.getDate() === 31 ? 'st' : selectedDate.getDate() === 2 || selectedDate.getDate() === 22 ? 'nd' : selectedDate.getDate() === 3 || selectedDate.getDate() === 23 ? 'rd' : 'th'} of every month
                        </span>
                      </div>
                    )}
                    {repeatPayout && selectedCadence === 'Weekly' && (
                      <div className="flex gap-6">
                        <span className="text-gray-500 w-28">Repeats on</span>
                        <span className="text-gray-900 flex-1">
                          Every {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                      </div>
                    )}
                    {repeatPayout && selectedCadence === 'Annually' && (
                      <div className="flex gap-6">
                        <span className="text-gray-500 w-28">Repeats on</span>
                        <span className="text-gray-900 flex-1">
                          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, every year
                        </span>
                      </div>
                    )}
                    {repeatPayout && lastInstanceDate && (
                      <div className="flex gap-6">
                        <span className="text-gray-500 w-28">Ends on</span>
                        <span className="text-gray-900 flex-1">{lastInstanceDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {selectedMethod !== 'email' && (
                    <div className="flex gap-6">
                      <span className="text-gray-500 w-28">Estimated arrival</span>
                      <span className="text-gray-900 flex-1">
                        {selectedMethod === 'ach' ? '2-3 business days' : selectedMethod === 'wire' ? 'Minutes' : selectedMethod === 'stablecoin' ? 'Seconds' : ''}
                      </span>
                    </div>
                    )}
                  </div>

                  {/* Fees section */}
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Fees</h3>
                    <div className="space-y-2 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payout amount</span>
                        <span className="text-gray-900">${formatCurrency(getPayoutAmountNum())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Standard payout fee</span>
                        <span className="text-gray-900">${formatCurrency(getFee())}</span>
                      </div>
                      {recipientCountry !== 'US' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Foreign exchange fee</span>
                          <span className="text-gray-900">${formatCurrency(getFxFee())}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">You'll pay</span>
                        <span className="text-gray-900 font-medium">${formatCurrency(getTotalPay())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">They'll receive</span>
                        <span className="text-gray-900 font-medium">
                          {recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `$${formatCurrency(getPayoutAmountNum())}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'success' && (
          <div className="px-5 pb-6 pt-12 animate-[fadeIn_0.3s_ease-out]">
            {/* Success tick */}
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Success message */}
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              {selectedMethod === 'email' ? (
                <>{recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `US$${formatCurrency(getPayoutAmountNum())}`} will be sent to {recipientEmail || 'mkerr@company.com'}</>
              ) : (
                <>{recipientCountry !== 'US' ? `${selectedCountry.currencySymbol}${formatCurrency(getTheyReceive())} ${selectedCountry.currency}` : `US$${formatCurrency(getPayoutAmountNum())}`} is on the way to <span className="text-indigo-600">{recipientEmail || 'mkerr@company.com'}</span></>
              )}
            </h2>
            <p className="text-gray-600 mb-10">
              {selectedMethod === 'email' ? (
                <>Your recipient will receive this money once they provide their details. If this doesn't happen in the next 3 days, the payout will be cancelled.</>
              ) : (
                <>This payout should arrive on {(() => {
                  const arrivalDate = new Date(selectedDate)
                  if (selectedMethod === 'ach') {
                    arrivalDate.setDate(arrivalDate.getDate() + 3)
                  }
                  return arrivalDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                })()}.</>
              )}
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div />
              <div className="flex gap-3">
                <button
                  onClick={() => resetModalForm()}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Send another
                </button>
                <button
                  onClick={closeSendModal}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-indigo-500 hover:bg-indigo-600"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* From account dropdown - rendered outside modal overflow */}
      {showFromDropdown && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowFromDropdown(false)} />
          <div
            className="fixed z-[61] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            style={{ top: fromDropdownPos.top, left: fromDropdownPos.left, width: fromDropdownPos.width }}
          >
            <div className="px-4 py-2 text-[12px] font-medium text-gray-900 border-b border-gray-100">Financial account</div>
            {fromAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  setSelectedFromAccount(account.id)
                  setShowFromDropdown(false)
                }}
                className={`w-full text-left px-4 h-12 flex items-center gap-3 hover:bg-gray-50 ${
                  account.id === selectedFromAccount ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm shrink-0">
                  {account.flag}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-gray-900">{account.name}</div>
                  <div className="text-[12px] text-gray-500">{account.currency}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-900">{account.symbol}{formatCurrency(account.balance)}</span>
                  {account.id === selectedFromAccount && (
                    <Icon name="checkmark" size="small" fill="#6366f1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-sm animate-[scaleIn_0.15s_ease-out]" style={{ boxShadow: '0 0 80px 40px rgba(255,255,255,0.9)' }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Exit payout?</h3>
            <p className="text-sm text-gray-500 mb-5">Your progress on this payout will not be saved.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Continue editing
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false)
                  closeSendModal()
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Country dropdown - rendered outside modal overflow */}
      {showCountryDropdown && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowCountryDropdown(false)} />
          <div
            className="fixed z-[61] bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto"
            style={{ top: countryDropdownPos.top, left: countryDropdownPos.left, width: countryDropdownPos.width }}
          >
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setRecipientCountry(country.code)
                  setShowCountryDropdown(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 ${
                  country.code === recipientCountry ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
                }`}
              >
                <span className="text-base">{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
