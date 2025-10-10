# ADR-011: GitHub Projects for Task Management

## Context

I needed a tool to:

- Organize project tasks
- Visualize progress clearly
- Integrate with GitHub issues and PRs
- Be free and simple to use
- Allow collaboration and tracking

## Decision

I implemented **GitHub Projects** for task management, utilizing:

- Kanban board to visualize workflow
- Columns: Backlog, Ready, In Progress, In Review, Done
- Native integration with issues and pull requests
- Estimates and progress metrics
- Automatic workflows for transitions

## More about

I really like using GitHub Projects in projects, it helps maintain focus and
organize tasks. The integration with issues is very good, when I create an
issue, it already appears on the board automatically, I can reference the PR
with the issue, which is linked to the task, so when merging the PR, the task is
automatically moved to Done.

It's also very good thinking about the open source side, because you can make
the project public and people can see the progress of tasks, assignments,
priorities, etc...

![GitHub Projects board showing Kanban workflow](/public/assets/images/blog/architecture-decisions/projects.png)
