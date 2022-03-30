import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { config } from '../config/config';
import { userService } from '../user/user_service';
import { loggerService } from '../logger/logger_service';
import { hashService } from '../hash/hash_service';
import { Unauthorized } from '../exception/http/unauthorized';

export class PassportStrategies {
  private readonly passport: passport.PassportStatic;

  constructor(passport: passport.PassportStatic) {
    this.passport = passport;
    this.serializeDeserialize();
  }

  public initializeStrategies() {
    this.local();
    this.jwt();
  };

  private serializeDeserialize() {
    this.passport.serializeUser((user, done) => {
      // @ts-ignore
      done(null, user.email);
    });
    this.passport.deserializeUser(async (email: string, done) => {
      const user = await userService.getOne(email);
      done(null, user);
    });
  };

  private local() {
    const LocalStrategy = passportLocal.Strategy;
    this.passport.use('local', new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password',
        },
        async (email, password, done) => {
          try {
            const user = await userService.getOne(email);
            await hashService.compare(password, user.password);
            done(null, user);
          } catch (error) {
            await loggerService.logger(`Sign in failed. ${error}`);
            done(new Unauthorized('Email or password are invalid.'));
          }
        }),
    );
  }

  private jwt() {
    const JwtStrategy = passportJwt.Strategy;
    this.passport.use('jwt', new JwtStrategy(
      {
        jwtFromRequest: passportJwt.ExtractJwt.fromHeader('authorization'),
        secretOrKey: config.env.JWT_ACCESS_TOKEN,
      }, async (payload, done) => {
        const user = await userService.getOne(payload);
        done(null, user);
      },
    ));
  }
}
