import firestore from '../../shims/firebase-firestore-web';
import { AppUser } from '../models/appUser';

class UserService {
  private usersCollection = firestore().collection('users');

  async addUser(user: AppUser) {
    await this.usersCollection.doc(user.uid).set(user);
  }

  async getUser(uid: string): Promise<AppUser> {
    const userDoc = await this.usersCollection.doc(uid).get();
    if (userDoc.exists) {
        return userDoc.data() as AppUser;
    } else {
        throw new Error('User not found');
    }
}
}

export default new UserService();
