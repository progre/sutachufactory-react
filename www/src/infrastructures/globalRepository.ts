import { GlobalStatus } from '../commons/domains/apis';
import { HOST } from './repositorycommon';

export async function fetchGlobalStatus() {
  const res = await fetch(`${HOST}/globalStatus`);
  return <GlobalStatus>await res.json();
}
