import { compose, init, last, groupBy, sort, descend, splitEvery, uniq, intersection, flatten, sortBy, prop, pipe, countBy, identity, F, forEach, range } from 'ramda';
import { collection, getDocs, setDoc, doc, getDoc, deleteDoc, query, where, or } from "firebase/firestore";
import { ROUND_ORDER } from './constants'
import { GROUPNAMES } from './browserapi'
var Diacritics = require('diacritic');

export const getCompGroupsV3 = (groupsAllocation) => {
  return groupsAllocation.split(',').reduce((p, c, index) => {
    const groupName = GROUPNAMES[index];
    return {
      ...p,
      [groupName]: range(1, +c + 1)
    }
  }, {});
}