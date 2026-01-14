'use client'

import { useEffect, useState, ReactNode } from 'react'
import { EarningsContent } from '@/components/driver/EarningsContent'
import { EarningsSkeleton } from '@/components/common/SkeletonLoaders'
import { BalanceData } from '@/actions/payouts'
import { DriverPayment } from '@/actions/payments/driver'
import { PayoutRecord } from '@/actions/payouts/my'
import { useToast } from '@/hooks/useToast'

interface EarningsPageClientProps {
  initialBalanceData: BalanceData | null
  initialIngresos: DriverPayment[]
  initialRetiros: PayoutRecord[]
  initialPaypalEmail: string | null
}

export const EarningsPageClient = ({
  initialBalanceData,
  initialIngresos,
  initialRetiros,
  initialPaypalEmail,
}: EarningsPageClientProps): ReactNode => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(initialBalanceData)
  const [ingresos, setIngresos] = useState<DriverPayment[]>(initialIngresos)
  const [retiros, setRetiros] = useState<PayoutRecord[]>(initialRetiros)
  const [paypalEmail, setPaypalEmail] = useState<string | null>(initialPaypalEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    setIsLoading(false)

    if (!initialBalanceData) {
      console.error('No balance data received')
    }
  }, [initialBalanceData])

  if (!mounted) {
    return <EarningsSkeleton />
  }

  // Mostrar skeleton si los datos no están disponibles
  if (!balanceData) {
    return <EarningsSkeleton />
  }

  return (
    <EarningsContent
      balanceData={balanceData}
      ingresos={ingresos}
      retiros={retiros}
      paypalEmail={paypalEmail}
      isLoading={isLoading}
    />
  )
}
