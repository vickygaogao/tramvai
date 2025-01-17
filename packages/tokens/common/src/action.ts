import { createToken } from '@tinkoff/dippy';
import type { Action } from '@tramvai/tokens-core';
import type { TramvaiAction } from '@tramvai/types-actions-state-context';
import type { ExecutionContext } from './execution';

/**
 * @description
 * Registry for storing actions based on their type
 */
export const ACTION_REGISTRY_TOKEN = createToken<ActionsRegistry>('actionRegistry');

/**
 * @description
 * Instance that executes actions
 */
export const ACTION_EXECUTION_TOKEN = createToken<ActionExecution>('actionExecution');

/**
 * @description
 * Instance that executes actions on navigations
 */
export const ACTION_PAGE_RUNNER_TOKEN = createToken<ActionPageRunner>('actionPageRunner');

/**
 * @description
 * Conditions that specify should action be executing or not
 */
export const ACTION_CONDITIONALS = createToken<ActionCondition | ActionCondition[]>(
  'actionConditionals',
  {
    multi: true,
  }
);

type AnyAction = Action | TramvaiAction<any, any, any>;

export interface ActionsRegistry {
  add(
    type: string,
    actions:
      | AnyAction
      | TramvaiAction<any[], any, any>
      | (AnyAction | TramvaiAction<any[], any, any>)[]
  ): void;

  get(
    type: string,
    addingActions?: (AnyAction | TramvaiAction<any[], any, any>)[]
  ): (AnyAction | TramvaiAction<any[], any, any>)[];
  getGlobal(): (AnyAction | TramvaiAction<any[], any, any>)[];

  remove(
    type: string,
    actions?:
      | AnyAction
      | TramvaiAction<any[], any, any>
      | (AnyAction | TramvaiAction<any[], any, any>)[]
  ): void;
}

export interface ActionExecution {
  run<Params extends any[], Result, Deps>(
    action: TramvaiAction<Params, Result, Deps>,
    ...params: Params
  ): Result extends Promise<any> ? Result : Promise<Result>;
  run<Payload, Result, Deps>(
    action: Action<Payload, Result, Deps>,
    payload: Payload
  ): Result extends Promise<any> ? Result : Promise<Result>;

  runInContext<Params extends any[], Result, Deps>(
    context: ExecutionContext | null,
    action: TramvaiAction<Params, Result, Deps>,
    ...params: Params
  ): Result extends Promise<any> ? Result : Promise<Result>;
  runInContext<Payload, Result, Deps>(
    context: ExecutionContext | null,
    action: Action<Payload, Result, Deps>,
    payload: Payload
  ): Result extends Promise<any> ? Result : Promise<Result>;
}

export interface ActionPageRunner {
  runActions(
    actions: (Action | TramvaiAction<any, any, any>)[],
    stopRunAtError?: (error: Error) => boolean
  ): Promise<any>;
}

export interface ActionConditionChecker<State = any> {
  payload: any;
  parameters: any;
  conditions: Record<string, any>;
  type: 'global' | 'local';
  allow(): void;
  setState(value: State): void;
  getState(): State;
  forbid(): void;
}

export type ActionCondition = {
  key: string;
  fn: (checker: ActionConditionChecker) => void;
};
