import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { hot, cold } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { OccConfig, OccSiteService } from '@spartacus/core';

import * as fromEffects from './languages.effect';
import * as fromActions from '../actions/languages.action';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SiteContextModule } from '../../site-context.module';

const MockOccModuleConfig: OccConfig = {
  server: {
    baseUrl: '',
    occPrefix: ''
  }
};

describe('Languages Effects', () => {
  let actions$: Observable<any>;
  let service: OccSiteService;
  let effects: fromEffects.LanguagesEffects;

  const data = {
    languages: [{ active: true, isocode: 'ja', name: 'Japanese' }]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        SiteContextModule
      ]
      // providers: [
      //   OccSiteService,
      //   { provide: OccConfig, useValue: MockOccModuleConfig },
      //   fromEffects.LanguagesEffects,
      //   provideMockActions(() => actions$)
      // ]
    });

    service = TestBed.get(OccSiteService);
    effects = TestBed.get(fromEffects.LanguagesEffects);

    spyOn(service, 'loadLanguages').and.returnValue(of(data));
  });

  describe('loadLanguages$', () => {
    it('should populate all languages from LoadLanguagesSuccess', () => {
      const action = new fromActions.LoadLanguages();
      const completion = new fromActions.LoadLanguagesSuccess(data.languages);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadLanguages$).toBeObservable(expected);
    });
  });
});