import { useUIStore } from '../../stores/uiStore'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useUIStore()

  const handleConfirm = () => {
    confirmDialog.onConfirm()
    hideConfirm()
  }

  return (
    <Modal
      open={confirmDialog.open}
      onClose={hideConfirm}
      title={confirmDialog.title}
      footer={
        <>
          <Button variant="secondary" onClick={hideConfirm}>取消</Button>
          <Button variant="danger" onClick={handleConfirm}>确认</Button>
        </>
      }
    >
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        {confirmDialog.message}
      </p>
    </Modal>
  )
}
