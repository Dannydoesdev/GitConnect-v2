import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/clientApp';
import { AuthContext } from '../../context/AuthContext';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { Button, Center } from '@mantine/core';

type RepoProps = {
  repoId?: string
  initialFirebaseData?: string
}



function ToggleHiddenStatus({ repoId }: RepoProps) {
  const { userData } = useContext(AuthContext)
  const userId = userData.userId
  const userName = userData.userName


  const [initialState, setInitialState] = useState(false);

  useEffect(() => {

    const getFirebaseData = async () => {

      const docRef = doc(db, `users/${userId}/repos/${repoId}`)
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const repoData = docSnap.data()
        const hiddenStatus = repoData.hidden

        setInitialState(hiddenStatus);
        
      }

    };
    getFirebaseData();
  }, []);


  async function handleToggleState() {

    const docRef = doc(db, `users/${userId}/repos/${repoId}`)
    const docSnap = await getDoc(docRef);
  
    
    if (docSnap.exists()) {
      const repoData = docSnap.data()
      const hiddenStatus = repoData.hidden

      if (hiddenStatus === true) {
        setInitialState(false)
        await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { hidden: false }, { merge: true })
          .then(() => {
            console.log(`Repo ${repoId} hidden status set to false`);
          })
          .catch((e) => { console.log(e); })
      } else {
        setInitialState(true)
        await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { hidden: true }, { merge: true })
          .then(() => {
            console.log(`Repo ${repoId} hidden status set to true`);
          })
          .catch((e) => { console.log(e); })
      }
    }
  
  }

  return (
    <>
      <Center>
        <Button
          component="a"
          size="lg"
          radius="md"
          mt={40}
          className='mx-auto'
          onClick={handleToggleState}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
              width: '40%',
              [theme.fn.smallerThan('sm')]: {
                width: '70%',
              },
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[7],
              },
            },
          })}
        >
          {initialState ? 'Show project' : 'Hide project'}
        </Button>
      </Center>
    </>
  )
}

export default ToggleHiddenStatus;