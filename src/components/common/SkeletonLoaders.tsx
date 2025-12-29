import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function CreateRouteSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between animate-pulse">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            {s < 3 && <div className="w-16 sm:w-24 h-1 mx-2 rounded bg-gray-200 dark:bg-gray-700" />}
          </div>
        ))}
      </div>

      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EarningsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DriverHomeSkeleton() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>

      {/* Routes */}
      <div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MyRoutesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== PASSENGER SKELETONS ==========

export function PassengerDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Próximo viaje */}
      <Card className="animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>

      {/* Rutas disponibles */}
      <div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RoutesSearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>

      {/* Search bar */}
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-48 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MyTripsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>

      {/* Tabs */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>

      {/* Trip cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ========== ADMIN SKELETONS ==========

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid de gestión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function UsersTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and filters */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Tabs */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>

      {/* Table */}
      <Card className="animate-pulse">
        <CardContent className="p-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"></div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function TransactionsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Transactions list */}
      <Card className="animate-pulse">
        <CardContent className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function RequestsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Tabs */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>

      {/* Requests list */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
