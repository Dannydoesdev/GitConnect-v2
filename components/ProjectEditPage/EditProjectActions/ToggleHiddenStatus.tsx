import { useState, useEffect, useContext } from 'react';
import { db } from '../../../firebase/clientApp';
import { AuthContext } from '../../../context/AuthContext';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Button, Center, Group, createStyles } from '@mantine/core';
import Link from 'next/link';
import { IconArrowBackUp } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  icon: {
    marginRight: theme.spacing.sm,
  },
}));

type RepoProps = {
  repoId?: string;
  initialFirebaseData?: string;
};

function ToggleHiddenStatus({ repoId }: RepoProps) {
  const { classes } = useStyles();

  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const userName = userData.userName;

  const [initialState, setInitialState] = useState(false);
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const getFirebaseData = async () => {
      const docRef = doc(db, `users/${userId}/repos/${repoId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const repoData = docSnap.data();

        const hiddenStatus = repoData.hidden;
        const hasImage = repoData.coverImage;

        setInitialState(hiddenStatus);

        if (!hasImage) {
          console.log('No image found');
          // alert("Sorry, you need to upload a cover image to unhide your project")
        } else {
          setCanShow(true);
        }
      }
    };
    getFirebaseData();
  }, []);

  async function handleToggleState() {
    const docRef = doc(db, `users/${userId}/repos/${repoId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && canShow == true) {
      const repoData = docSnap.data();
      const hiddenStatus = repoData.hidden;

      if (hiddenStatus === true) {
       
        await setDoc(
          doc(db, `users/${userId}/repos/${repoId}`),
          { hidden: false },
          { merge: true }
        )
          .then(() => {
            setInitialState(false);
            // console.log(`Repo ${repoId} hidden status set to false`);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
       
        await setDoc(
          doc(db, `users/${userId}/repos/${repoId}`),
          { hidden: true },
          { merge: true }
        )
          .then(() => {
            setInitialState(true);
            // console.log(`Repo ${repoId} hidden status set to true`);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      alert('Sorry, you need to upload a cover image to unhide your project');
    }
  }

  return (
    <>
      {/* <Center> */}
      <Group position='center'>
        <Link href={`/profiles/projects/${repoId}`} passHref legacyBehavior>
          <Button
            component='a'
            size='lg'
            radius='md'
            mt={40}
            className='mx-auto'
            // onClick={handleToggleState}
            styles={(theme) => ({
              root: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.blue[6],
                width: '20%',
                [theme.fn.smallerThan('sm')]: {
                  width: '70%',
                },
                '&:hover': {
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[6]
                      : theme.colors.blue[7],
                },
              },
            })}
          >
            <IconArrowBackUp className={classes.icon} size={22} />
            {/* empty space */}
            {/* <span>  </span> */}
            {/* <span>{'   '}</span> */}
            Back to Project Page
          </Button>
        </Link>
      </Group>
      <Group position='center'>
        <Button
          component='a'
          size='lg'
          radius='md'
          mt={40}
          className='mx-auto'
          onClick={handleToggleState}
          styles={(theme) => ({
            root: {
              backgroundColor: initialState
                ? // && theme.colorScheme === 'dark'
                  theme.colors.green[6]
                : theme.colors.gray[5],

              // 'Revert to draft'

              width: '20%',
              [theme.fn.smallerThan('sm')]: {
                width: '70%',
              },
              '&:hover': {
                backgroundColor: initialState
                  ? // && theme.colorScheme === 'dark'
                    theme.colors.green[8]
                  : theme.colors.yellow[8],
              },
              //     theme.colorScheme === 'dark'
              //       ? theme.colors.dark[6]
              //       : theme.colors.blue[7],
              // },
            },
          })}
        >
          {initialState ? 'Publish project' : 'Revert to draft project'}
        </Button>
      </Group>
      {/* </Center> */}
    </>
  );
}

export default ToggleHiddenStatus;
function createUseStyles(arg0: (theme: any) => { root: {} }) {
  throw new Error('Function not implemented.');
}
