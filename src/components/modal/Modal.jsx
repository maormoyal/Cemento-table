// src/components/Modal.js
import styles from './Modal.module.scss';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
