import { Context } from '@actions/github/lib/context';

export type GitHubContext = Context;

export interface AgentParams {
  commitMessage?: string;
}
