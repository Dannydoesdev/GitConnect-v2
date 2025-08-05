import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import * as nodemailer from 'nodemailer';

initializeApp();

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const emailConfig = functions.config().email;
  if (emailConfig && emailConfig.password) {
    logger.info('Email config found');
    logger.info('Email config: ', functions.config().email);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'daniel.t.mcgee@gmail.com',
      pass: functions.config().email.password,
    },
  });
  logger.info('Function triggered: New user sign-up detected test.');

  const email = user.email;
  const displayName = user.displayName;

  logger.info(
    `Extracted user information: Email: ${email}, Display Name: ${displayName}`
  );

  const mailOptions = {
    from: 'daniel.t.mcgee@gmail.com',
    to: 'daniel.t.mcgee@gmail.com',
    subject: 'New GitConnect Sign Up',
    text: `A new user ${displayName} has signed up with email: ${email}`,
  };

  logger.info('Prepared mail options. About to send the email...');

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email successfully sent to: ${mailOptions.to}`);
  } catch (error) {
    logger.error(`Error encountered while sending email: ${error}`);
  }
});

export const makeUsernameLowercaseInUsersCollectionAndPublicDataCollection =
  onRequest(async (req, res) => {
    const db = getFirestore();

    const usersRef = db.collection('users');
    const eventshot = await usersRef.get();

    const batch = db.batch();
    for (const userDoc of eventshot.docs) {
      const userName = userDoc.data().userName;
      if (typeof userName === 'string') {
        const username_lowercase = userName.toLowerCase();
        batch.update(usersRef.doc(userDoc.id), { username_lowercase });

        const profileDataRef = usersRef
          .doc(userDoc.id)
          .collection('profileData');
        const profileDataSnapshot = await profileDataRef.get();

        for (const profileDataDoc of profileDataSnapshot.docs) {
          batch.update(profileDataDoc.ref, { username_lowercase });
        }
      }
    }
    await batch.commit();
    res
      .status(200)
      .send('Updated usernames in users collection and publicData documents.');
  });

export const duplicateToDeprecateGithubDataCollection = onRequest(
  async (req, res) => {
    const db = getFirestore();
    const usersRef = db.collection('users');
    const eventshot = await usersRef.get();

    const batch = db.batch();
    for (const userDoc of eventshot.docs) {
      const userId = userDoc.id;
      logger.log('trying userId', userId);
      const profileDataRef = usersRef.doc(userId).collection('profileData');
      const publicDataRef = profileDataRef.doc('publicData');
      if (publicDataRef) {
        logger.log('publicData found');
      }
      const githubDataRef = profileDataRef.doc('githubData');
      const githubDataSnapshot = await githubDataRef.get();
      if (githubDataSnapshot.exists) {
        logger.log('githubData found');

        batch.set(
          publicDataRef,
          { ...githubDataSnapshot.data() },
          { merge: true }
        );
      }
    }

    await batch.commit();
    res.status(200).send('Duplicated githubData to publicData.');
  }
);

export const addLowercaseUsernameAndReponameInReposAndMainContentCollections =
  onRequest(async (req, res) => {
    const db = getFirestore();
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.get();

    const batch = db.batch();

    for (const userDoc of userSnapshot.docs) {
      const userName = userDoc.data().userName;
      logger.log('found userName', userName);

      if (typeof userName === 'string') {
        const username_lowercase = userName.toLowerCase();
        const repoDataRef = userDoc.ref.collection('repos');

        const repoDataSnapshot = await repoDataRef.get();
        for (const repoDoc of repoDataSnapshot.docs) {
          const repoName = repoDoc.data().name;
          logger.log('found repoName', repoName);

          if (typeof repoName === 'string') {
            const reponame_lowercase = repoName.toLowerCase();
            logger.log(
              'reponame and username lowercase',
              reponame_lowercase,
              username_lowercase
            );
            batch.set(
              repoDoc.ref,
              { username_lowercase, reponame_lowercase },
              { merge: true }
            );
            logger.log(
              'set lowercase_username and lowercase_reponame in user, repo: ',
              userName,
              repoName
            );

            const projectDataRef = repoDoc.ref
              .collection('projectData')
              .doc('mainContent');
            batch.set(
              projectDataRef,
              { username_lowercase, reponame_lowercase },
              { merge: true }
            );
            logger.log(
              'set lowercase_username and lowercase_reponame in mainContent'
            );
          }
        }
      }
    }

    await batch.commit();
    res.status(200).send('Added lowercase_username in mainContent documents.');
  });
