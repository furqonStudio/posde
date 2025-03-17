import { Button } from '../ui/button'
import { RefreshCcw } from 'lucide-react'

export const ErrorState = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground">
          Gagal mengambil data. Silakan coba lagi.
        </p>
      </div>
      <Button onClick={() => location.reload()}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  )
}
