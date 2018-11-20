import Joi from 'joi';

export default {
  validateBody(body) {
    const schema = Joi.object().keys({
      code: Joi.string().required(),
      name: Joi.string().required(),
      link: Joi.string(),
      module_id: Joi.string(),
      form_id: Joi.string(),
      parent_id: Joi.string()
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
