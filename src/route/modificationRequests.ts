// import { Router } from 'express';
// import { validate } from 'express-validation';

// import { handleError, authenticate, checkUserType } from '../middleware';
// import {
//   createModifyRequestValidation,
//   createModifyRequest,
//   getModifyRequestValidation,
//   getAll,
//   deleteModifyRequestValidation,
//   removeModifyRequest,
//   updateModifyRequestById,
//   updateModifyRequestByIdValidation,
//   getModifyRequestById,
//   getModifyRequestByIdValidation
// } from '../controller/carts';

// import { WebMartUserType } from '../constants';

// const router = Router();

// const getModifyRequests = (): Router => 
//   router.get(
//     '/',
//     authenticate,
//     validate(getModifyRequestValidation, { context: true }),
//     handleError(getAll()),
//   );

// const postCreateModifyRequest = (): Router =>
//   router.post(
//     '/',
//     authenticate,
//     checkUserType(WebMartUserType.ADMIN, WebMartUserType.USER),
//     validate(createModifyRequestValidation, { context: true }),
//     handleError(createModifyRequest()),
//   );

// const getModifyRequestUsingId = (): Router =>
// router.get(
//   '/:id',
//   authenticate,
//   validate(getModifyRequestByIdValidation, { context: true }),
//   handleError(getModifyRequestById()),
// );

// const deleteUpdateModifyRequest = (): Router =>
//   router.delete(
//     '/:id',
//     authenticate,
//     checkUserType(WebMartUserType.ADMIN, WebMartUserType.USER, WebMartUserType.SELLER),
//     validate(deleteModifyRequestValidation, { context: true }),
//     handleError(removeModifyRequest()),
//   );

//   const updateModifyRequests = (): Router =>
//   router.put(
//     '/:id',
//     authenticate,
//     validate(updateModifyRequestByIdValidation, { context: true }),
//     handleError(updateModifyRequestById()),
//   );

// export default (): Router =>
//   router.use([
//     getModifyRequests(),
//     postCreateModifyRequest(),
//     getModifyRequestUsingId(),
//     deleteUpdateModifyRequest(),
//     updateModifyRequests(),
//   ]);
