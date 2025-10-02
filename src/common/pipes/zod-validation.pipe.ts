import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'
import { ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata) {
    console.log('Validating value:', value)
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      const validationError = fromZodError(error)
      throw new BadRequestException(validationError.toString())
    }
  }
}
