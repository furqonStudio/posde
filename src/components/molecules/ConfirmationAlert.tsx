import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ConfirmationProps = {
  title?: string
  description?: string
  cancelText?: string
  actionText?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onClick: () => void
}

export const ConfirmationAlert = ({
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete data',
  cancelText = 'Cancel',
  actionText = 'Delete',
  open,
  onOpenChange,
  onClick,
}: ConfirmationProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
