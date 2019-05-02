import { Contact } from './contact';
import { Experience } from './experience';
import { Skill } from './skill';
import { Work } from './work';
import { Education } from './education';
import { User } from './user';

export interface Portfolio extends Readonly<{
    id?: number,
    name?: string,
    description?: string,
    picturePath?: string,
    resumePath?: string,
    contact?: Contact,
    experiences?: Experience[],
    skills?: Skill[],
    works?: Work[],
    educations?: Education[],
    idOfUser?: number,
    user?: User
}>{}
