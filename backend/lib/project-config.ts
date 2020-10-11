/*
 * ------ CAUTIONS --------
 * 
 * If you modify the value in this file, it might occur a lot of unexpected resource deletion in the entire stacks.
 * You're definitely aware of what you're doing.
 * 
 * ------------------------
 */
export const StackConfig = {
    PROJ_PREF: 'aws-commday-2020',
    DEPLOY_ENV: process.env.DEPLOY_ENV || 'dev',
}