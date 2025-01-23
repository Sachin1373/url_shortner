import React,{useState} from 'react';
import DeleteAccount from '../modals/deleteaccount';
import styles from '../Styles/setting.module.css';

function Settings() {

   const [deleteaccmodal,setdeleteaccmodal] = useState(false)
  
      const opendeleteaccmodal = () =>{
        setdeleteaccmodal(true)
      }
  
      const closedeleteaccmodal = () =>{
        setdeleteaccmodal(false)
      }

  return (
    <div className={styles.container}>
         {deleteaccmodal ? <DeleteAccount closedeleteaccmodal={closedeleteaccmodal}  /> : null}
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder='Enter name' />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email id</label>
        <input type="email" id="email" placeholder='Enter email'  />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="mobile">Mobile no.</label>
        <input type="text" id="mobile" placeholder='Enter mobile no.' />
      </div>
      <button type="button" className={styles.saveButton}>
        Save Changes
      </button>
      <button type="button" className={styles.deleteButton} onClick={opendeleteaccmodal}>
        Delete Account
      </button>
    </div>
  );
}

export default Settings;