import { Context } from '@actions/github/lib/context';

export type GitHubContext = Context;

export interface AgentParams {
  commit?: string;
  branch?: string;
  pr?: string;
  commitMessage?: string;
}
