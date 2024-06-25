function assertValidRepoConfig(repo) {
  if (typeof repo === 'string') {
    if (!repo.includes('/')) {
      throw new Error(`Invalid repo config: ${repo}. It must be in the form owner/name`);
    }
  }
  if (typeof repo === 'object') {
    if (!repo.owner && !repo.name) {
      throw new Error(`Invalid repo config: owner and name are missing`);
    }
    if (!repo.owner) {
      throw new Error(`Invalid repo config: owner is missing`);
    }
    if (!repo.name) {
      throw new Error(`Invalid repo config: name is missing`);
    }
  }
}

function Keystatic(props) {
  if (props.config.storage.kind === 'github') {
    assertValidRepoConfig(props.config.storage.repo);
  }
  return null;
}

export { Keystatic };
