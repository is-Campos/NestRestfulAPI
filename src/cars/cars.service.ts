import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [];

  findAll() {
    console.log(this.cars);
    return this.cars;
  }

  findOneById(id: string) {
    const foundCar = this.cars.find((car) => car.id === id);

    if (!foundCar) throw new NotFoundException(`car with id '${id}' not found`);

    return foundCar;
  }

  create(createCarDto: CreateCarDto) {
    const car: Car = {
      id: uuid(),
      ...createCarDto,
    };

    this.cars.push(car);
    return car;
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    let carDB = this.findOneById(id);

    if (updateCarDto.id && updateCarDto.id !== id) {
      throw new BadRequestException(`Car id is not valid`);
    }

    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        carDB = {
          ...carDB,
          ...updateCarDto,
          id,
        };
        return carDB;
      }
      return car;
    });
    return carDB;
  }

  delete(id: string) {
    const carDB = this.findOneById(id);

    if (!carDB) {
      throw new NotFoundException();
    }

    this.cars = this.cars.filter((car) => car.id !== id);
    return carDB;
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
